'use client';

import { Button } from '@/components/ui/button';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="container mx-auto p-6">
            <div className="rounded-md border border-red-200 bg-red-50 p-6">
                <h1 className="text-lg font-semibold text-red-800 mb-2">Ocurrió un error al cargar el inventario</h1>
                <p className="text-sm text-red-700 mb-4">Puedes intentar de nuevo. Si el problema persiste, contacta al administrador.</p>
                <div className="flex items-center gap-3">
                    <Button variant="default" onClick={() => reset()}>
                        Reintentar
                    </Button>
                    <details className="text-xs text-red-700">
                        <summary>Detalles técnicos</summary>
                        <pre className="mt-2 whitespace-pre-wrap">{error?.message || 'Error desconocido'}</pre>
                    </details>
                </div>
            </div>
        </div>
    );
}


