import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom CFE semantic colors
        "cfe-green": {
          DEFAULT: "#008E5A", // CFE Green
          foreground: "#FFFFFF", // White text for CFE Green
          "very-light": "#E6F4EF", // Very light CFE Green
        },
        /**
         * =================================================================
         * SEMANTIC STATUS COLOR SYSTEM - REFACTOR 2024
         * =================================================================
         * This is the single source of truth for all status-related colors.
         * It maps semantic names (e.g., 'available') to CSS variables.
         *
         * DO NOT use utility classes like `bg-green-500` for statuses directly.
         * Instead, use semantic classes like `bg-status-available-bg`.
         *
         * MIGRATION STATUS:
         * - ✅ NEW: The nested `status: { ... }` object is the recommended system.
         * - ⚠️ LEGACY: The flat "status-available" keys are @deprecated and kept
         *   only for backward compatibility with parts of the dashboard.
         * - TODO: Migrate all legacy usages and remove the flat keys.
         */
        // Status colors with semantic structure
        status: {
          available: {
            bg: "hsl(var(--status-available-bg))",
            text: "hsl(var(--status-available-text))"
          },
          assigned: {
            bg: "hsl(var(--status-assigned-bg))",
            text: "hsl(var(--status-assigned-text))"
          },
          lent: {
            bg: "hsl(var(--status-lent-bg))",
            text: "hsl(var(--status-lent-text))"
          },
          pendingRetire: {
            bg: "hsl(var(--status-pending-retire-bg))",
            text: "hsl(var(--status-pending-retire-text))"
          },
          retired: {
            bg: "hsl(var(--status-retired-bg))",
            text: "hsl(var(--status-retired-text))"
          },
          approved: {
            bg: "hsl(var(--status-approved-bg))",
            text: "hsl(var(--status-approved-text))"
          },
          rejected: {
            bg: "hsl(var(--status-rejected-bg))",
            text: "hsl(var(--status-rejected-text))"
          },
          pending: {
            bg: "hsl(var(--status-pending-bg))",
            text: "hsl(var(--status-pending-text))"
          },
          info: {
            bg: "hsl(var(--status-info-bg))",
            text: "hsl(var(--status-info-text))"
          },
          success: {
            bg: "hsl(var(--status-success-bg))",
            text: "hsl(var(--status-success-text))"
          },
          error: {
            bg: "hsl(var(--status-error-bg))",
            text: "hsl(var(--status-error-text))"
          },
          warning: {
            bg: "hsl(var(--status-warning-bg))",
            text: "hsl(var(--status-warning-text))"
          },
          default: {
            bg: "hsl(var(--status-default-bg))",
            text: "hsl(var(--status-default-text))"
          }
        },
        // Legacy status colors (keeping for backward compatibility)
        "status-available": {
          DEFAULT: "#008E5A", // Verde CFE
          foreground: "#FFFFFF",
        },
        "status-lent": {
          DEFAULT: "#F59E0B", // Amarillo/Ámbar
          foreground: "hsl(20 14.3% 4.1%)", // Dark text for yellow
        },
        "status-assigned": {
          DEFAULT: "#6366F1", // Púrpura/Índigo
          foreground: "#FFFFFF",
        },
        "status-pending-retire": {
          DEFAULT: "#F97316", // Naranja
          foreground: "#FFFFFF",
        },
        "status-retired": {
          DEFAULT: "#EF4444", // Rojo Destructivo
          foreground: "#FFFFFF",
        },
        // New semantic colors for text emphasis
        "cfe-text-on-green": {
          DEFAULT: "#FFFFFF", // White text on CFE Green backgrounds
        },
        "cfe-black": {
          DEFAULT: "#111111",
        },
        "highlight-yellow": {
          DEFAULT: "#FFFFE0",
        },
        // Toast specific colors for enhanced visual appeal
        "toast-success": {
          DEFAULT: "#10B981", // Emerald-500
          light: "#D1FAE5", // Emerald-100
          border: "#A7F3D0", // Emerald-200
          ring: "#6EE7B7", // Emerald-300
        },
        "toast-error": {
          DEFAULT: "#EF4444", // Red-500
          light: "#FEE2E2", // Red-100
          border: "#FECACA", // Red-200
          ring: "#F87171", // Red-300
        },
        "toast-warning": {
          DEFAULT: "#F59E0B", // Amber-500
          light: "#FEF3C7", // Amber-100
          border: "#FDE68A", // Amber-200
          ring: "#FBBF24", // Amber-300
        },
        "toast-info": {
          DEFAULT: "#3B82F6", // Blue-500
          light: "#DBEAFE", // Blue-100
          border: "#BFDBFE", // Blue-200
          ring: "#93C5FD", // Blue-300
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Toast animations
        "toast-slide-in": {
          "0%": {
            transform: "translateX(100%) scale(0.95)",
            opacity: "0"
          },
          "50%": {
            transform: "translateX(-5%) scale(1.02)",
            opacity: "0.8"
          },
          "100%": {
            transform: "translateX(0%) scale(1)",
            opacity: "1"
          },
        },
        "toast-slide-out": {
          "0%": {
            transform: "translateX(0%) scale(1)",
            opacity: "1"
          },
          "50%": {
            transform: "translateX(20%) scale(0.98)",
            opacity: "0.5"
          },
          "100%": {
            transform: "translateX(100%) scale(0.95)",
            opacity: "0"
          },
        },

        "toast-bounce-in": {
          "0%": {
            transform: "scale(0.3)",
            opacity: "0"
          },
          "50%": {
            transform: "scale(1.05)",
            opacity: "0.8"
          },
          "70%": {
            transform: "scale(0.9)",
            opacity: "0.9"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "toast-slide-in": "toast-slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "toast-slide-out": "toast-slide-out 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "toast-bounce-in": "toast-bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
