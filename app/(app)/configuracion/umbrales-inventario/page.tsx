"use client";
import React, { useState, useMemo } from 'react';
import { useApp } from '@/contexts/app-context';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function InventoryThresholdsConfigPage() {
    const {
        state,
        setProductLowStockThreshold,
        setCategoryLowStockThreshold,
        setGlobalLowStockThreshold,
        cleanOrphanThresholds,
    } = useApp();
    const { user } = useAuthStore();

    // Estado local para edición del umbral global
    const [globalInput, setGlobalInput] = useState(state.lowStockThresholds.globalThreshold.toString());
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // --- Tabla de productos ---
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 8;
    // Filtro y paginación
    const filteredProducts = useMemo(() => {
        return state.inventoryData.filter(p =>
            p.nombre.toLowerCase().includes(search.toLowerCase()) ||
            p.categoria.toLowerCase().includes(search.toLowerCase())
        );
    }, [state.inventoryData, search]);
    const paginatedProducts = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredProducts.slice(start, start + pageSize);
    }, [filteredProducts, page, pageSize]);
    const totalPages = Math.ceil(filteredProducts.length / pageSize);

    // Estado local para inputs de umbral por producto
    const [productInputs, setProductInputs] = useState<{ [id: number]: string }>({});
    const [productSaving, setProductSaving] = useState<{ [id: number]: boolean }>({});
    const [productSuccess, setProductSuccess] = useState<{ [id: number]: string | null }>({});
    const [productError, setProductError] = useState<{ [id: number]: string | null }>({});

    const handleProductInput = (id: number, value: string) => {
        setProductInputs(inputs => ({ ...inputs, [id]: value }));
    };
    const handleProductSave = (id: number) => {
        setProductSuccess(s => ({ ...s, [id]: null }));
        setProductError(e => ({ ...e, [id]: null }));
        const value = Number(productInputs[id]);
        if (isNaN(value) || value <= 0) {
            setProductError(e => ({ ...e, [id]: 'El umbral debe ser un número positivo.' }));
            return;
        }
        setProductSaving(s => ({ ...s, [id]: true }));
        try {
            setProductLowStockThreshold(id, value);
            setProductSuccess(s => ({ ...s, [id]: 'Umbral actualizado.' }));
            // TODO: Log de auditoría (quién, cuándo, valor anterior/nuevo)
        } catch (e) {
            setProductError(e => ({ ...e, [id]: 'Error al guardar.' }));
        } finally {
            setProductSaving(s => ({ ...s, [id]: false }));
        }
    };
    const handleProductDelete = (id: number) => {
        setProductLowStockThreshold(id, null);
        setProductInputs(inputs => ({ ...inputs, [id]: '' }));
        setProductSuccess(s => ({ ...s, [id]: 'Umbral eliminado (usa fallback).' }));
        // TODO: Log de auditoría (quién, cuándo, valor anterior/nuevo)
    };

    // --- Umbral global (igual que antes) ---
    const handleGlobalSave = () => {
        setSuccess(null);
        setError(null);
        const value = Number(globalInput);
        if (isNaN(value) || value <= 0) {
            setError('El umbral debe ser un número positivo.');
            return;
        }
        setSaving(true);
        try {
            setGlobalLowStockThreshold(value);
            setSuccess('Umbral global actualizado correctamente.');
            // TODO: Log de auditoría (quién, cuándo, valor anterior/nuevo)
        } catch (e) {
            setError('Ocurrió un error al guardar el umbral.');
        } finally {
            setSaving(false);
        }
    };

    // Estado y handlers para inputs de categoría
    const [categoryInputs, setCategoryInputs] = useState<{ [cat: string]: string }>({});
    const [categorySaving, setCategorySaving] = useState<{ [cat: string]: boolean }>({});
    const [categorySuccess, setCategorySuccess] = useState<{ [cat: string]: string | null }>({});
    const [categoryError, setCategoryError] = useState<{ [cat: string]: string | null }>({});
    const handleCategoryInput = (cat: string, value: string) => {
        setCategoryInputs(inputs => ({ ...inputs, [cat]: value }));
    };
    const handleCategorySave = (cat: string) => {
        setCategorySuccess(s => ({ ...s, [cat]: null }));
        setCategoryError(e => ({ ...e, [cat]: null }));
        const value = Number(categoryInputs[cat]);
        if (isNaN(value) || value <= 0) {
            setCategoryError(e => ({ ...e, [cat]: 'El umbral debe ser un número positivo.' }));
            return;
        }
        setCategorySaving(s => ({ ...s, [cat]: true }));
        try {
            setCategoryLowStockThreshold(cat, value);
            setCategorySuccess(s => ({ ...s, [cat]: 'Umbral actualizado.' }));
            // TODO: Log de auditoría (quién, cuándo, valor anterior/nuevo)
        } catch (e) {
            setCategoryError(e => ({ ...e, [cat]: 'Error al guardar.' }));
        } finally {
            setCategorySaving(s => ({ ...s, [cat]: false }));
        }
    };
    const handleCategoryDelete = (cat: string) => {
        setCategoryLowStockThreshold(cat, null);
        setCategoryInputs(inputs => ({ ...inputs, [cat]: '' }));
        setCategorySuccess(s => ({ ...s, [cat]: 'Umbral eliminado (usa fallback).' }));
        // TODO: Log de auditoría (quién, cuándo, valor anterior/nuevo)
    };

    // Estado y lógica para búsqueda de categorías
    const [categorySearch, setCategorySearch] = useState('');
    const filteredCategories = useMemo(() => {
        return state.categorias.filter(cat =>
            cat.toLowerCase().includes(categorySearch.toLowerCase())
        );
    }, [state.categorias, categorySearch]);

    const isAdmin = user?.rol === 'Administrador';
    if (!isAdmin) {
        return (
            <div className="container mx-auto py-16 flex flex-col items-center justify-center">
                <div className="flex items-center gap-3 text-red-800 bg-red-50 border-l-4 border-red-500 shadow-md rounded px-6 py-4 text-lg animate-fadeInSlide" aria-live="polite">
                    <AlertTriangle className="h-6 w-6" />
                    Acceso denegado. Solo los administradores pueden configurar umbrales de inventario bajo.
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-2">Configuración de Umbrales de Inventario Bajo</h1>
            <p className="text-muted-foreground mb-6 max-w-2xl">
                Define los umbrales mínimos de stock para productos y categorías. Si un producto no tiene umbral propio, se usará el de su categoría; si tampoco, el global. Estos umbrales determinan las alertas de "Inventario Bajo" en el dashboard.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Columna 1: Tabla de productos */}
                <section>
                    <h2 className="text-lg font-semibold mb-2">Umbrales por Producto</h2>
                    <input
                        type="text"
                        placeholder="Buscar producto o categoría..."
                        className="mb-3 border rounded px-2 py-1 w-full"
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        aria-label="Buscar producto o categoría"
                    />
                    <div className="border rounded-lg bg-card text-card-foreground min-h-[480px]">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-muted">
                                    <th className="p-2 text-left">Producto</th>
                                    <th className="p-2 text-left">Categoría</th>
                                    <th className="p-2 text-center">Cantidad</th>
                                    <th className="p-2 text-center">Umbral</th>
                                    <th className="p-2 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProducts.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center text-muted-foreground py-8">Sin resultados</td></tr>
                                ) : paginatedProducts.map(product => {
                                    const current = state.lowStockThresholds.productThresholds[product.id];
                                    return (
                                        <tr key={product.id} className="border-b last:border-b-0">
                                            <td className="p-2">{product.nombre}</td>
                                            <td className="p-2">{product.categoria}</td>
                                            <td className="p-2 text-center">{product.cantidad}</td>
                                            <td className="p-2 text-center">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    className="border rounded px-2 py-1 w-20 text-center focus-visible:ring focus-visible:ring-cfe-green transition-shadow duration-150"
                                                    value={productInputs[product.id] ?? (current ?? '')}
                                                    onChange={e => handleProductInput(product.id, e.target.value)}
                                                    aria-label={`Editar umbral para ${product.nombre}. Si se elimina, se usará el umbral de la categoría o el global.`}
                                                    tabIndex={0}
                                                    title="El umbral mínimo de stock para este producto. Si se elimina, se usará el de la categoría o el global."
                                                />
                                            </td>
                                            <td className="p-2 text-center">
                                                <div className="flex flex-row justify-center items-center gap-2">
                                                    <button
                                                        className="h-8 px-3 py-1.5 bg-cfe-green text-white rounded hover:bg-cfe-green/90 transition-colors focus-visible:ring focus-visible:ring-cfe-green"
                                                        onClick={() => handleProductSave(product.id)}
                                                        disabled={productSaving[product.id] || Number(productInputs[product.id]) === current}
                                                        aria-label={`Guardar umbral para ${product.nombre}`}
                                                        tabIndex={0}
                                                    >
                                                        Guardar
                                                    </button>
                                                    <button
                                                        className="h-8 px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors focus-visible:ring focus-visible:ring-red-500"
                                                        onClick={() => handleProductDelete(product.id)}
                                                        disabled={productSaving[product.id] || current === undefined}
                                                        aria-label={`Eliminar umbral para ${product.nombre}`}
                                                        tabIndex={0}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {/* Paginación */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 py-2">
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2">&lt;</button>
                                <span>Página {page} de {totalPages}</span>
                                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2">&gt;</button>
                            </div>
                        )}
                    </div>
                    {/* Feedback por producto */}
                    <div className="mt-2 space-y-1">
                        {paginatedProducts.map(product => (
                            <div key={product.id}>
                                {productSuccess[product.id] && (
                                    <div className="flex items-center gap-3 mt-2 text-green-800 bg-green-50 border-l-4 border-green-500 shadow-md rounded px-4 py-2 text-base animate-fadeInSlide" aria-live="polite">
                                        <CheckCircle className="h-5 w-5" />
                                        {productSuccess[product.id]}
                                    </div>
                                )}
                                {productError[product.id] && (
                                    <div className="flex items-center gap-3 mt-2 text-red-800 bg-red-50 border-l-4 border-red-500 shadow-md rounded px-4 py-2 text-base animate-fadeInSlide" aria-live="polite">
                                        <AlertTriangle className="h-5 w-5" />
                                        {productError[product.id]}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
                {/* Columna 2: Tabla de categorías y umbral global */}
                <section className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Umbrales por Categoría</h2>
                        <input
                            type="text"
                            placeholder="Buscar categoría..."
                            className="mb-3 border rounded px-2 py-1 w-full"
                            value={categorySearch}
                            onChange={e => { setCategorySearch(e.target.value); }}
                            aria-label="Buscar categoría"
                        />
                        <div className="border rounded-lg bg-card text-card-foreground min-h-[480px]">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-muted">
                                        <th className="p-2 text-left">Categoría</th>
                                        <th className="p-2 text-center">Umbral</th>
                                        <th className="p-2 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCategories.length === 0 ? (
                                        <tr><td colSpan={3} className="text-center text-muted-foreground py-8">Sin resultados</td></tr>
                                    ) : filteredCategories.map(category => {
                                        const current = state.lowStockThresholds.categoryThresholds[category];
                                        return (
                                            <tr key={category} className="border-b last:border-b-0">
                                                <td className="p-2">{category}</td>
                                                <td className="p-2 text-center">
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        className="border rounded px-2 py-1 w-20 text-center focus-visible:ring focus-visible:ring-cfe-green transition-shadow duration-150"
                                                        value={categoryInputs[category] ?? (current ?? '')}
                                                        onChange={e => handleCategoryInput(category, e.target.value)}
                                                        aria-label={`Editar umbral para categoría ${category}. Si se elimina, se usará el umbral global.`}
                                                        tabIndex={0}
                                                        title="El umbral mínimo de stock para esta categoría. Si se elimina, se usará el global."
                                                    />
                                                </td>
                                                <td className="p-2 text-center">
                                                    <div className="flex flex-row justify-center items-center gap-2">
                                                        <button
                                                            className="h-8 px-3 py-1.5 bg-cfe-green text-white rounded hover:bg-cfe-green/90 transition-colors focus-visible:ring focus-visible:ring-cfe-green"
                                                            onClick={() => handleCategorySave(category)}
                                                            disabled={categorySaving[category] || Number(categoryInputs[category]) === current}
                                                            aria-label={`Guardar umbral para categoría ${category}`}
                                                            tabIndex={0}
                                                        >
                                                            Guardar
                                                        </button>
                                                        <button
                                                            className="h-8 px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors focus-visible:ring focus-visible:ring-red-500"
                                                            onClick={() => handleCategoryDelete(category)}
                                                            disabled={categorySaving[category] || current === undefined}
                                                            aria-label={`Eliminar umbral para categoría ${category}`}
                                                            tabIndex={0}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {/* Feedback por categoría */}
                            <div className="mt-2 space-y-1">
                                {filteredCategories.map(category => (
                                    <div key={category}>
                                        {categorySuccess[category] && (
                                            <div className="flex items-center gap-3 mt-2 text-green-800 bg-green-50 border-l-4 border-green-500 shadow-md rounded px-4 py-2 text-base animate-fadeInSlide" aria-live="polite">
                                                <CheckCircle className="h-5 w-5" />
                                                {categorySuccess[category]}
                                            </div>
                                        )}
                                        {categoryError[category] && (
                                            <div className="flex items-center gap-3 mt-2 text-red-800 bg-red-50 border-l-4 border-red-500 shadow-md rounded px-4 py-2 text-base animate-fadeInSlide" aria-live="polite">
                                                <AlertTriangle className="h-5 w-5" />
                                                {categoryError[category]}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Umbral Global</h2>
                        <div className="border rounded-lg p-4 bg-card text-card-foreground flex items-center gap-4">
                            <label htmlFor="global-threshold" className="font-medium">Umbral global actual:</label>
                            <input
                                id="global-threshold"
                                type="number"
                                min={1}
                                className="border rounded px-2 py-1 w-20 text-center"
                                value={globalInput}
                                onChange={e => setGlobalInput(e.target.value)}
                                aria-label="Editar umbral global"
                            />
                            <button
                                className="px-4 py-1 bg-cfe-green text-white rounded hover:bg-cfe-green/90 transition-colors disabled:opacity-60"
                                onClick={handleGlobalSave}
                                disabled={saving || Number(globalInput) === state.lowStockThresholds.globalThreshold}
                                aria-label="Guardar umbral global"
                                tabIndex={0}
                            >
                                Guardar
                            </button>
                        </div>
                        {/* Feedback visual enterprise para umbral global */}
                        {success && (
                            <div className="flex items-center gap-3 mt-2 text-green-800 bg-green-50 border-l-4 border-green-500 shadow-md rounded px-4 py-2 text-base animate-fadeInSlide" aria-live="polite">
                                <CheckCircle className="h-5 w-5" />
                                {success}
                            </div>
                        )}
                        {error && (
                            <div className="flex items-center gap-3 mt-2 text-red-800 bg-red-50 border-l-4 border-red-500 shadow-md rounded px-4 py-2 text-base animate-fadeInSlide" aria-live="polite">
                                <AlertTriangle className="h-5 w-5" />
                                {error}
                            </div>
                        )}
                    </div>
                    <div>
                        <button
                            className="mt-2 px-4 py-2 bg-cfe-green text-white rounded hover:bg-cfe-green/90 transition-colors"
                            onClick={cleanOrphanThresholds}
                            aria-label="Limpiar umbrales huérfanos"
                            tabIndex={0}
                        >
                            Limpiar umbrales huérfanos
                        </button>
                    </div>
                </section>
            </div>
            {/* TODO: Accesibilidad, feedback, protección de ruta, integración con backend */}
            {/* Animación fade-in */}
            <style jsx global>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fadeIn { animation: fadeIn 0.3s ease; }
                @keyframes fadeInSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeInSlide { animation: fadeInSlide 0.4s cubic-bezier(0.4,0,0.2,1); }
            `}</style>
        </div>
    );
} 