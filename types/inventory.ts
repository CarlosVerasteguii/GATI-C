// New type for history events
export interface HistoryEvent {
    date: string;
    user: string;
    action: string;
    details: string;
}

// This type represents an individual item in the database or context.
export interface InventoryItem {
    id: number;
    name: string;
    brand: string;
    model: string;
    serialNumber: string | null;
    category: string;
    description?: string;
    status: InventoryStatus;
    quantity: number;
    entryDate: string;
    location?: string;
    provider?: string;
    cost?: number;
    purchaseDate?: string;
    warrantyExpirationDate?: string | null; // YYYY-MM-DD
    usefulLife?: string;
    history?: HistoryEvent[];
    attachedDocuments?: { name: string; url: string }[];
    isSerialized?: boolean;
    contractId?: string | null;
    assignedTo?: string | null;
    assignmentDate?: string | null;
    lentTo?: string | null;
    loanDate?: string | null;
    returnDate?: string | null;
    reactKey?: string;
    isVirtual?: boolean;
    originalId?: number;
}

// This type represents a user.
export interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
    role: "ADMINISTRATOR" | "EDITOR" | "READER";
    department?: string;
}

// This is the type for our GROUPED data structure used by the table.
// Combines parent product information with its children.
export interface GroupedProduct {
    isParent: true;
    product: {
        id: string;
        name: string;
        brand: string;
        model: string;
        category: string;
        isSerialized: boolean;
    };
    summary: {
        total: number;
        available: number;
        states: {
            [key: string]: number;
        };
    };
    children: InventoryItem[];
    highlightedChildId?: string | null;
}

export interface AdvancedFilterState {
    startDate: Date | null;
    endDate: Date | null;
    provider: string;
    contractId: string;
    minCost: number | null;
    maxCost: number | null;
}

// Definition of a column in the inventory table
export interface ColumnDefinition {
    id: string;
    label: string;
    defaultVisible: boolean;
    sortable: boolean;
    type?: 'string' | 'number' | 'date' | 'status';
    fixed?: "start" | "end";
    visible?: boolean;
}

// Type for inventory statuses
export type InventoryStatus = "AVAILABLE" | "ASSIGNED" | "LENT" | "RETIRED" | "PENDING_RETIREMENT";

// Type for loan statuses
export type LoanStatus = "ACTIVE" | "RETURNED" | "EXPIRED";

// Type for assignment statuses
export type AssignmentStatus = "ACTIVE" | "RETURNED";

// Type for task statuses
export type TaskStatus =
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "QUICK_LOAD"
    | "QUICK_RETIREMENT"
    | "BULK_EDIT"
    | "BULK_ASSIGNMENT"
    | "BULK_LOAN"
    | "BULK_RETIREMENT"; 