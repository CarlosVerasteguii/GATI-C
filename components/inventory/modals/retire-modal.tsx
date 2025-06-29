'use client';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

export function RetireModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Retiro Rápido de Activos</DialogTitle>
                    <DialogDescription>
                        Formulario de Retiro Rápido (en construcción)...
                    </DialogDescription>
                </DialogHeader>
                {/* Aquí irá el formulario en la siguiente fase */}
            </DialogContent>
        </Dialog>
    );
} 