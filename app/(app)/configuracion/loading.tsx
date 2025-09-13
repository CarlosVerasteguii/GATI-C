import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ConfigurationLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Configuración del Sistema</h1>
        <Skeleton className="h-10 w-32" />
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" disabled>
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="access-requests" disabled>
            Solicitudes de Acceso
          </TabsTrigger>
          <TabsTrigger value="attributes" disabled>
            Atributos Personalizados
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Cargando...</h2>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-10 flex-1" />
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Card>
              <CardHeader>
                <CardTitle>Cargando Datos...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
      </Tabs>
    </div>
  )
}
