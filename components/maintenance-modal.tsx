git add ."use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { InventoryItem } from "@/types/inventory"
import { showSuccess, showError } from "@/hooks/use-toast"

const formSchema = z.object({
  provider: z.string().min(1, "Debe especificar un proveedor de mantenimiento"),
  notes: z.string().optional(),
})

type MaintenanceFormValues = z.infer<typeof formSchema>

interface MaintenanceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: InventoryItem | null
  onSuccess?: () => void
}

export function MaintenanceModal({
  open,
  onOpenChange,
  product,
  onSuccess
}: MaintenanceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: "",
      notes: "",
    },
  })

  function onSubmit(data: MaintenanceFormValues) {
    if (!product) return

    setIsSubmitting(true)

    // Simulación de envío
    setTimeout(() => {
      setIsSubmitting(false)
      
      showSuccess({
        title: "Enviado a mantenimiento",
        description: `${product.nombre} ha sido marcado como en mantenimiento con ${data.provider}.`,
      })
      
      onOpenChange(false)
      if (onSuccess) onSuccess()
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enviar a mantenimiento</DialogTitle>
          <DialogDescription>
            Complete los detalles del mantenimiento para {product?.nombre}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor de mantenimiento</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del proveedor" {...field} />
                  </FormControl>
                  <FormDescription>
                    Empresa o persona que realizará el mantenimiento
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas adicionales</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalles del mantenimiento a realizar..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Procesando..." : "Enviar a mantenimiento"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 