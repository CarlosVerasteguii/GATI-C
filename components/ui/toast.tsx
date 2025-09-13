"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import {
  X,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Sparkles
} from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] gap-3",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start justify-between space-x-4 overflow-hidden rounded-lg border p-4 pr-8 transition-all duration-300 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-toast-slide-in data-[state=closed]:animate-toast-slide-out",
  {
    variants: {
      variant: {
        default:
          "border-border bg-background text-foreground shadow-lg",
        success:
          "border-emerald-300 bg-emerald-50 text-emerald-900 shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-200 dark:border-emerald-700 dark:bg-emerald-900 dark:text-emerald-50 dark:shadow-emerald-500/20 dark:ring-emerald-800",
        error:
          "border-red-300 bg-red-50 text-red-900 shadow-lg shadow-red-500/25 ring-1 ring-red-200 dark:border-red-700 dark:bg-red-900 dark:text-red-50 dark:shadow-red-500/20 dark:ring-red-800",
        warning:
          "border-amber-300 bg-amber-50 text-amber-900 shadow-lg shadow-amber-500/25 ring-1 ring-amber-200 dark:border-amber-700 dark:bg-amber-900 dark:text-amber-50 dark:shadow-amber-500/20 dark:ring-amber-800",
        info:
          "border-blue-300 bg-blue-50 text-blue-900 shadow-lg shadow-blue-500/25 ring-1 ring-blue-200 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-50 dark:shadow-blue-500/20 dark:ring-blue-800",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25 ring-1 ring-destructive/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Icon mapping for each variant
const getToastIcon = (variant: string) => {
  switch (variant) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
    case "error":
      return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
    case "info":
      return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
    case "destructive":
      return <AlertCircle className="h-5 w-5 text-destructive-foreground flex-shrink-0 mt-0.5" />
    default:
      return <Sparkles className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
  }
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
  VariantProps<typeof toastVariants> & {
    showIcon?: boolean
  }
>(({ className, variant, showIcon = true, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), "toast-container", className)}
      {...props}
    >
      {/* Container for icon and content */}
      <div className="flex items-start space-x-3 flex-1">
        {showIcon && getToastIcon(variant || "default")}
        <div className="flex-1 min-w-0">
          {props.children}
        </div>
      </div>
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-gray-400 opacity-0 transition-all hover:text-gray-600 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 hover:bg-gray-100 active:scale-95 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90 mt-1", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
