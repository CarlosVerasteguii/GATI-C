'use client';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

export function AssignModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Asignar Activo desde Stock</DialogTitle>
                    <DialogDescription>
                        Formulario de Asignación (en construcción)...
                    </DialogDescription>
                </DialogHeader>
                {/* Aquí irá el formulario en la siguiente fase */}
            </DialogContent>
        </Dialog>
    );
} 