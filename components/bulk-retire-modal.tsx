"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useApp } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Trash2 } from "lucide-react"
import { mockRetireReasons } from "@/lib/mocks/inventory-mock-data"
import { useEffect } from "react"

// Esquema del formulario
const formSchema = z.object({
  retireReason: z.string().min(1, "Debe seleccionar un motivo."),
  notes: z.string().optional(),
})

type BulkRetireModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedProducts: any[]
  onSuccess: () => void
}

export function BulkRetireModal({ open, onOpenChange, selectedProducts, onSuccess }: BulkRetireModalProps) {
  const { addPendingTask } = useApp()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { retireReason: "", notes: "" },
  })

  // Limpia el formulario cuando el modal se cierra
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Aquí iría la lógica para llamar a addPendingTask en el futuro

    onSuccess()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Retirar {selectedProducts.length} Producto(s)
          </DialogTitle>
          <DialogDescription>
            Se creará una tarea pendiente para la baja definitiva de los productos seleccionados.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="retireReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo del Retiro</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un motivo..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockRetireReasons.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          {reason.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Adicionales (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Contexto adicional sobre el retiro masivo..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" variant="destructive">Crear Tarea de Retiro</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
