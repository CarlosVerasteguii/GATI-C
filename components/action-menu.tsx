"use client"

import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip" // Import Tooltip components
import type React from "react" // Import React for React.ElementType

interface ActionMenuItem {
  label: string
  onClick: () => void
  destructive?: boolean
  disabled?: boolean
  tooltip?: string
  icon?: React.ElementType // Add icon prop
}

interface ActionMenuProps {
  actions: ActionMenuItem[]
  isReadOnly?: boolean
}

export function ActionMenu({ actions, isReadOnly = false }: ActionMenuProps) {
  return (
    <TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((action, index) => {
            const content = (
              <DropdownMenuItem
                key={index}
                onClick={action.onClick}
                className={action.destructive ? "text-red-600" : ""}
                disabled={action.disabled || (isReadOnly && action.label !== 'Ver Detalles')}
              >
                {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                {action.label}
              </DropdownMenuItem>
            )

            return action.disabled && action.tooltip ? (
              <Tooltip key={index}>
                <TooltipTrigger asChild>{content}</TooltipTrigger>
                <TooltipContent>
                  <p>{action.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              content
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}
