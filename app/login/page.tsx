"use client"

import * as React from "react"
import { Suspense } from "react"
import ParticleBackground from "@/components/ui/particle-background"
import { LoginForm } from "@/components/login-form"

function LoginFallback() {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span>Cargando...</span>
            </div>
        </div>
    )
}

export default function LoginPage() {
  return (
    <>
      <ParticleBackground />
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <Suspense fallback={<LoginFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </>
  )
}