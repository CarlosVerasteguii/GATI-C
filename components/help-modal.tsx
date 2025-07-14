"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { HelpCircle } from "lucide-react" // Import icon

interface HelpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HelpModal({ open, onOpenChange }: HelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Acerca de GATI-C
          </DialogTitle>
          <DialogDescription>Sistema de Gestión de Activos Tecnológicos e Inventario de CFE.</DialogDescription>
        </DialogHeader>
        <div className="py-4 text-sm text-muted-foreground space-y-2">
          <p>
            GATI-C es una herramienta integral diseñada para optimizar la gestión y el control de los activos
            tecnológicos de la División Golfo Centro dentro de la Comisión Federal de Electricidad (CFE).
          </p>
          <p>
            Permite un seguimiento preciso del inventario, la asignación y préstamo de equipos, el registro de
            mantenimientos y retiros, y la generación de reportes detallados para una toma de decisiones eficiente.
          </p>
          <p>
            Desarrollado con el objetivo de mejorar la trazabilidad y la eficiencia operativa en la administración de
            recursos tecnológicos.
          </p>
          <p className="font-semibold text-right pt-2">Versión: 8.1</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
