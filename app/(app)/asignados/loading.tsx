import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * AssignedLoading - Componente de carga para la página de Artículos Asignados.
 * Muestra un esqueleto de carga mientras se esperan los datos reales.
 */
export default function AssignedLoading() {
  return (
    <div className="flex flex-col gap-4">
      {/* Encabezado con título y botón de acción */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Artículos Asignados</h1>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Controles de búsqueda y filtrado */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Tabla de contenido principal */}
      <div className="border rounded-lg overflow-hidden">
        <Card>
          <CardHeader>
            <CardTitle>Cargando Asignaciones...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Generar 5 filas de esqueleto para representar los datos que están cargando */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
