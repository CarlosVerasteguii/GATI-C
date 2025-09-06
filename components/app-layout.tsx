"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Package,
  LayoutDashboard,
  Users,
  History,
  Settings,
  LogOut,
  Menu,
  ClipboardList,
  Handshake,
  UserCheck,
  Loader2,
  FileText,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/lib/stores/useAuthStore"
import { ThemeToggle } from "@/components/theme-toggle"
import { useDevice } from "@/hooks/use-device"
import { useNavigation } from "@/hooks/use-navigation"
import { usePendingTasks } from "@/hooks/use-pending-tasks"
import { useGatiKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { KeyboardShortcutsHelp } from "@/components/keyboard-shortcuts-help"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const { isMobile, isTablet } = useDevice()

  // Hooks para las nuevas funcionalidades
  const { isNavigating, loadingPage } = useNavigation()
  const { total: pendingTasksCount, isLoading: tasksLoading } = usePendingTasks()

  // Configurar atajos de teclado
  useGatiKeyboardShortcuts({
    toggleSidebar: () => setSidebarCollapsed(prev => !prev),
    goToDashboard: () => router.push('/dashboard'),
    goToInventory: () => router.push('/inventario'),
    goToTasks: () => router.push('/tareas-pendientes')
  })

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["Administrador", "Editor", "Lector"],
    },
    {
      name: "Inventario",
      href: "/inventario",
      icon: Package,
      roles: ["Administrador", "Editor", "Lector"],
    },
    {
      name: "Préstamos",
      href: "/prestamos",
      icon: Handshake,
      roles: ["Administrador", "Editor", "Lector"],
    },
    {
      name: "Asignados",
      href: "/asignados",
      icon: UserCheck,
      roles: ["Administrador", "Editor", "Lector"],
    },
    {
      name: "Tareas Pendientes",
      href: "/tareas-pendientes",
      icon: ClipboardList,
      roles: ["Administrador", "Editor"],
    },
    {
      name: "Historial",
      href: "/historial",
      icon: History,
      roles: ["Administrador", "Editor", "Lector"],
    },
    {
      name: "Papelera Documentos",
      href: "/papelera-documentos",
      icon: Trash2,
      roles: ["Administrador", "Editor"],
    },
    {
      name: "Configuración",
      href: "/configuracion",
      icon: Settings,
      roles: ["Administrador"],
    },

  ]

  const filteredNavItems = navItems.filter((item) => {
    if (!user) return false
    const mappedRole = user.role === 'ADMINISTRADOR' ? 'Administrador' : user.role === 'EDITOR' ? 'Editor' : 'Lector'
    return item.roles.includes(mappedRole)
  })

  // Ajustar el tamaño de los iconos y el espaciado según el dispositivo
  const getIconSize = () => {
    if (isMobile) return "h-5 w-5"
    if (isTablet) return "h-5 w-5"
    return "h-6 w-6"
  }

  const getSidebarWidth = () => {
    if (sidebarCollapsed) return "md:grid-cols-[80px_1fr]"
    if (isTablet) return "md:grid-cols-[260px_1fr]"
    return "md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]"
  }

  return (
    <div className={`grid min-h-screen w-full ${getSidebarWidth()}`}>
      {/* Sidebar for Desktop - Ahora con posición fija */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex flex-col h-full">
          <div className="flex h-16 items-center border-b px-6 lg:h-[68px]">
            <Link href="/" className="flex items-center gap-3 font-semibold">
              <Package className="h-7 w-7 text-cfe-green" />
              <span className="text-xl">GATI-C</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <nav className="grid items-start px-4 text-base font-medium gap-3 lg:px-5">
              {filteredNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                const isLoadingThis = isNavigating && loadingPage === item.href
                const showBadge = item.name === "Tareas Pendientes" && pendingTasksCount > 0

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center rounded-lg px-4 py-3 transition-all hover:text-primary relative ${sidebarCollapsed ? "justify-center gap-0" : "gap-4"
                      } ${isActive ? "bg-muted text-primary font-semibold" : "text-muted-foreground"
                      } ${isLoadingThis ? "opacity-75" : ""}`}
                    prefetch={false}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <Icon className={`${getIconSize()} ${isLoadingThis ? "animate-pulse" : ""}`} />

                    {!sidebarCollapsed && (
                      <>
                        <span className="text-base flex-1">{item.name}</span>

                        {/* Badge de contador para Tareas Pendientes */}
                        {showBadge && (
                          <Badge
                            className={`text-xs px-2 py-1 ${pendingTasksCount > 5
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-amber-500 hover:bg-amber-600 text-white"
                              }`}
                            title={`${pendingTasksCount} tareas pendientes`}
                          >
                            {pendingTasksCount > 99 ? '99+' : pendingTasksCount}
                          </Badge>
                        )}

                        {/* Indicador de carga */}
                        {isLoadingThis && (
                          <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                        )}
                      </>
                    )}

                    {/* Badge en modo colapsado - como dot notification */}
                    {sidebarCollapsed && showBadge && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
          {/* Sección de usuario removida para consolidar acciones en el header */}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col">
        {/* Header for Mobile and Desktop */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-semibold">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                  <Package className="h-6 w-6 text-cfe-green" />
                  <span className="sr-only">GATI-C</span>
                </Link>
                {filteredNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  const isLoadingThis = isNavigating && loadingPage === item.href
                  const showBadge = item.name === "Tareas Pendientes" && pendingTasksCount > 0

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 relative ${isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                        } hover:text-foreground ${isLoadingThis ? "opacity-75" : ""}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      prefetch={false}
                    >
                      <Icon className={`h-5 w-5 ${isLoadingThis ? "animate-pulse" : ""}`} />
                      <span className="flex-1">{item.name}</span>

                      {/* Badge para móvil */}
                      {showBadge && (
                        <Badge
                          className={`text-xs px-2 py-1 ${pendingTasksCount > 5
                            ? "bg-red-500 text-white"
                            : "bg-amber-500 text-white"
                            }`}
                        >
                          {pendingTasksCount > 99 ? '99+' : pendingTasksCount}
                        </Badge>
                      )}

                      {/* Indicador de carga móvil */}
                      {isLoadingThis && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </Link>
                  )
                })}
              </nav>
              {/* Sección de usuario en menú móvil removida para consolidar acciones en el header */}
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1 flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-xl">
              {navItems.find((item) => item.href === pathname)?.name || "GATI-C"}
            </h1>

            {/* Indicadores globales y ayuda */}
            <div className="flex items-center gap-2">
              {/* Indicador de carga global */}
              {isNavigating && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Cargando...</span>
                </div>
              )}

              {/* Ayuda de atajos de teclado */}
              <KeyboardShortcutsHelp />

              {/* Tema claro/oscuro */}
              <ThemeToggle />

              {/* Menú de usuario */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        {(user?.name?.[0] || "U").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user?.name || "Cuenta"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => router.push('/perfil')}>
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleLogout}>
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Breadcrumbs - Solo en desktop y tablet */}
        {!isMobile && (
          <div className="px-4 py-2 border-b border-border/50 bg-background/50">
            <Breadcrumbs />
          </div>
        )}

        <main className={`flex flex-1 flex-col gap-4 p-4 ${isMobile ? '' : 'lg:gap-6 lg:p-6'}`}>
          {children}
        </main>
      </div>
    </div>
  )
}
