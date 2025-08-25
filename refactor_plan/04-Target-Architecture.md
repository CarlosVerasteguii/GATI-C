# 4. Frontend: Target Architecture Manifest

This document describes the ideal state of the GATI-C frontend architecture after the refactoring is complete. All refactored code must adhere to these patterns to ensure consistency, maintainability, and scalability. This architecture follows modern React patterns with clear separation of concerns.

## Architecture Principles

### Core Tenets
- **Single Responsibility**: Each module, component, and function has one clear purpose
- **Data Flow**: Unidirectional data flow from server → hooks → smart components → dumb components
- **Composition over Inheritance**: Favor composition for component reusability
- **Explicit Dependencies**: All dependencies are explicitly declared and injected
- **Testability**: Architecture designed to maximize testability at every level

## 1. Data Fetching & Server State Management

### Primary Tool: SWR
**SWR** is the primary tool for managing server state. Use your judgment - pragmatism over dogma.

### Implementation Pattern

#### Flexible SWR Usage
**Simple GET requests** can use `useSWR` directly in components:
```typescript
// ✅ ALLOWED - Simple GET requests directly in components
function ProductList() {
    const { data: products, error, isLoading } = useSWR('/api/products', apiClient.get);
    // ...
}
```

#### Custom SWR Hooks (For Complex Logic)
**Complex logic** or **frequently reused** data should use custom hooks:
```typescript
// hooks/useProducts.ts - For complex business logic
export function useProducts() {
    return useSWR('/api/products', apiClient.get, {
        // Complex configuration, caching, etc.
    });
}

// hooks/useCreateProduct.ts - For mutations
export function useCreateProduct() {
    return useSWRMutation('/api/products', apiClient.post);
}
```

### Usage Guidelines
- **Simple reads**: `useSWR` directly in components
- **Complex logic**: Custom hooks in `hooks/` directory
- **Mutations**: Custom hooks for consistency
- **Shared data**: Custom hooks to avoid duplication

### SWR Configuration
All SWR hooks use consistent configuration:
```typescript
// lib/swr-config.ts
export const swrConfig = {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,
    errorRetryCount: 3,
};
```

## 2. Global State Management

### Primary Tool: React Context API
**Simple AuthContext** for user session. Local state with `useState` for everything else.

### AuthContext for User Session
```typescript
// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/me');
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        // Persist to localStorage if needed
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
```

### UI State with Local useState
```typescript
// components/Sidebar.tsx
function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    // Simple local state for UI concerns
}
```

### When to Use Global State
- **User session**: AuthContext (persisted across app)
- **UI preferences**: Local state or localStorage
- **Form state**: Local state within form components
- **Server data**: Always use SWR, never global state

## 3. Component Architecture

### Smart Components (Containers/Pages)
Located in `app/` directory. Responsible for:
- Data fetching via SWR hooks
- State management and coordination
- Passing data and callbacks to dumb components
- Business logic orchestration

```typescript
// app/(app)/inventory/page.tsx
'use client';

export default function InventoryPage() {
    const { data: products, error, isLoading } = useProducts();
    const createProduct = useCreateProduct();

    const handleCreateProduct = async (productData: CreateProductData) => {
        await createProduct.trigger(productData);
    };

    return (
        <div>
            <ProductTable
                products={products || []}
                isLoading={isLoading}
                onCreateProduct={handleCreateProduct}
            />
        </div>
    );
}
```

### Dumb Components (Presentational)
Located in `components/` directory. Characteristics:
- Receive all data via props
- Emit events via callback functions
- Minimal to no internal state
- Pure functions when possible

```typescript
// components/ProductTable.tsx
interface ProductTableProps {
    products: Product[];
    isLoading: boolean;
    onCreateProduct: (data: CreateProductData) => void;
}

export function ProductTable({ products, isLoading, onCreateProduct }: ProductTableProps) {
    return (
        <div>
            {products.map(product => (
                <ProductRow
                    key={product.id}
                    product={product}
                    onEdit={(id) => console.log('Edit', id)}
                />
            ))}
        </div>
    );
}
```

### Component Composition Pattern
```typescript
// components/ProductForm.tsx - Smart component that manages form state
export function ProductForm({ onSubmit, initialData }: ProductFormProps) {
    const [formData, setFormData] = useState(initialData);

    return (
        <form onSubmit={() => onSubmit(formData)}>
            <ProductFormFields
                data={formData}
                onChange={setFormData}
            />
            <Button type="submit">Save</Button>
        </form>
    );
}

// components/ProductFormFields.tsx - Pure presentational component
export function ProductFormFields({ data, onChange }: ProductFormFieldsProps) {
    return (
        <div>
            <Input
                value={data.name}
                onChange={(e) => onChange({ ...data, name: e.target.value })}
            />
            {/* ... other fields */}
        </div>
    );
}
```

## 4. API Layer

### Consolidated API Client
**One global fetcher** handles all HTTP requests, authentication, and data mapping.

### Global API Client
```typescript
// lib/apiClient.ts - Single consolidated API client
import { User, Product } from '@/types/domain'; // From Domain Encyclopedia

class ApiClient {
    private baseURL: string;

    constructor() {
        this.baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';
    }

    private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
        const token = localStorage.getItem('auth-token');

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return response.json();
    }

    // Generic CRUD methods
    async get<T>(endpoint: string): Promise<T> {
        return this.request(endpoint);
    }

    async post<T>(endpoint: string, data: any): Promise<T> {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put<T>(endpoint: string, data: any): Promise<T> {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete(endpoint: string): Promise<void> {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

export const apiClient = new ApiClient();
```

## 5. Data Mapping Layer

### Data Transformation Strategy
**Transform data at the edges** - don't pollute business logic with mapping concerns.

### API Response Mapping
```typescript
// lib/mappers/productMapper.ts
import { Product } from '@/types/domain';

export function mapApiProductToDomain(apiProduct: any): Product {
    return {
        id: apiProduct.id,
        name: apiProduct.name,
        serialNumber: apiProduct.serial_number || null,
        cost: apiProduct.cost || null,
        // Transform API naming to domain naming
        purchaseDate: apiProduct.purchase_date ? new Date(apiProduct.purchase_date) : null,
        // Handle enum transformations
        status: mapApiStatusToDomain(apiProduct.status),
        // ... other mappings
    };
}

export function mapDomainProductToApi(domainProduct: Product): any {
    return {
        id: domainProduct.id,
        name: domainProduct.name,
        serial_number: domainProduct.serialNumber,
        cost: domainProduct.cost,
        purchase_date: domainProduct.purchaseDate?.toISOString(),
        status: mapDomainStatusToApi(domainProduct.status),
        // ... other transformations
    };
}
```

### SWR with Automatic Mapping
```typescript
// hooks/useProducts.ts
export function useProducts() {
    return useSWR(
        '/api/products',
        async (url) => {
            const apiProducts = await apiClient.get(url);
            return apiProducts.map(mapApiProductToDomain);
        }
    );
}
```

## 6. UI Type Definitions

### Component-Specific Types
**Define UI types alongside components** - keep them co-located.

### Form Component Types
```typescript
// components/ProductForm.tsx
import { Product } from '@/types/domain';

interface ProductFormData {
    name: string;
    serialNumber: string;
    cost: number;
    // UI-specific fields
    isSubmitting: boolean;
    errors: Record<string, string>;
}

interface ProductFormProps {
    initialData?: Partial<Product>;
    onSubmit: (data: Product) => Promise<void>;
    onCancel?: () => void;
}

// Component with co-located types
export function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        name: initialData?.name || '',
        serialNumber: initialData?.serialNumber || '',
        cost: initialData?.cost || 0,
        isSubmitting: false,
        errors: {},
    });

    // Component implementation...
}
```

### Table Component Types
```typescript
// components/ProductTable.tsx
interface ProductTableColumn {
    id: string;
    label: string;
    sortable?: boolean;
    width?: number;
}

interface ProductTableProps {
    products: Product[];
    columns: ProductTableColumn[];
    isLoading?: boolean;
    onSort?: (columnId: string) => void;
    onRowClick?: (product: Product) => void;
}

export function ProductTable({ products, columns, isLoading, onSort, onRowClick }: ProductTableProps) {
    // Component implementation...
}
```

## 7. Simplified File Structure

### Keep It Simple
```
src/
├── app/                    # Next.js pages (smart components)
│   ├── inventory/page.tsx
│   ├── login/page.tsx
│   └── layout.tsx
├── components/             # UI components (dumb components)
│   ├── ui/                # Reusable UI (buttons, inputs, etc.)
│   ├── ProductForm.tsx    # Business components
│   └── ProductTable.tsx
├── hooks/                 # SWR hooks for data
│   ├── useProducts.ts
│   └── useAuth.ts
├── lib/                   # Utilities
│   ├── apiClient.ts       # Single API client
│   ├── mappers/          # Data transformation
│   └── utils.ts
├── types/                 # TypeScript definitions
│   └── domain.ts          # Single domain types file
└── contexts/              # React contexts
    └── AuthContext.tsx
```

### Pragmatic Naming
- **Use consistent patterns** but don't over-engineer
- **PascalCase** for components and types
- **camelCase** for everything else
- **Co-locate related files** when it makes sense

## 8. Essential Patterns (Keep It Simple)

### Error Handling
```typescript
// Simple error handling - don't overcomplicate
function ProductTable({ products, error, isLoading }: ProductTableProps) {
    if (error) {
        return <div>Failed to load products. <button onClick={() => window.location.reload()}>Retry</button></div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <table>{/* Render products */}</table>;
}
```

### Testing
```typescript
// Test what matters - don't over-test
test('ProductTable renders products', () => {
    const products = [{ id: '1', name: 'Test Product' }];
    render(<ProductTable products={products} isLoading={false} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
});
```

### Performance
```typescript
// Simple memo for frequently re-rendering components
const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
    return <div>{product.name}</div>;
});
```

## 9. Migration Strategy (Pragmatic)

### Phase 1: Core Data & Auth (Week 1)
- Set up `apiClient.ts` and AuthContext
- Update core types using Domain Encyclopedia
- Basic SWR setup for critical data

### Phase 2: Essential Features (Weeks 2-3)
- Refactor P0 and P1 files (high impact)
- Implement data mapping layer
- Update main pages and components

### Phase 3: Polish & Test (Weeks 4-5)
- Handle remaining P2 and P3 files
- Add basic error handling and loading states
- Write essential tests

### Success Metrics
- ✅ **Works**: Core functionality functional
- ✅ **Fast**: UI responds quickly (under 3 seconds)
- ✅ **Reliable**: No critical crashes
- ✅ **Maintainable**: Other developers can understand and modify

## Final Implementation Checklist

### Must Have (Non-Negotiable)
- [ ] English naming from Domain Encyclopedia
- [ ] AuthContext working for user sessions
- [ ] SWR for server data (flexible usage)
- [ ] Consolidated API client
- [ ] Data mapping between API and domain

### Should Have (Strongly Recommended)
- [ ] Smart/dumb component separation
- [ ] Basic error handling for user-facing flows
- [ ] Co-located UI types with components
- [ ] Essential tests for critical paths

### Nice to Have (Add When Time Allows)
- [ ] Advanced error boundaries
- [ ] Comprehensive testing
- [ ] Performance optimizations
- [ ] Advanced security features

---

**This is your pragmatic North Star** - a flexible guide that prioritizes working software over architectural perfection. Use your judgment, keep it simple, and focus on delivering value to users.