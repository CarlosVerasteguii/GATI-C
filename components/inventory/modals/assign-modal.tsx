'use client';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

type AssignModalProps = {
    isOpen: boolean;
    onClose: () => void;
    productData: any | null; // Recibe los datos del producto
};

export function AssignModal({ isOpen, onClose, productData }: AssignModalProps) {
    if (!productData) return null; // No renderizar nada si no hay datos

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Asignar: {productData.product.nombre}</DialogTitle>
                    <DialogDescription>
                        Disponible: {productData.summary.disponible} unidades.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Formulario de Asignación (en construcción)...</p>
                    {/* Aquí irá el formulario en la siguiente fase */}
                </div>
            </DialogContent>
        </Dialog>
    );
} 