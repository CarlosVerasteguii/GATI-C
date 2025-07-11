"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const colorThemes = {
  cfe: { name: "CFE", colors: ["#008E5A", "#FFFFFF", "#BDBDBD", "#9E9E9E"] }, // Verde, Blanco, Gris, Gris Claro
  cosmic: { name: "Cosmic", colors: ["#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4"] },
}

type ParticleShape = "circle" | "square" | "triangle" | "star"

export default function ParticleBackground({ isModalOpen }: { isModalOpen?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const isLargeScreen = useRef(false)
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  const particleCount = 120
  const particleSpeed = .48
  const particleSize = 3
  const randomizeSizes = true
  const colorThemeKey = "cfe"
  const particleShapeKey: ParticleShape = "circle"
  const showConnections = true
  const connectionDistance = 100

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setCanvasDimensions = () => {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      isLargeScreen.current = window.innerWidth > 1920
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    let mouseX = canvas.width / 2
    let mouseY = canvas.height / 2

    const updateMousePosition = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const updateTouchPosition = (e: TouchEvent) => {
      e.preventDefault()
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX
        mouseY = e.touches[0].clientY
      }
    }

    window.addEventListener("mousemove", updateMousePosition)
    window.addEventListener("touchmove", updateTouchPosition, { passive: false })
    window.addEventListener("touchstart", updateTouchPosition, { passive: false })
    
    let isMouseDown = false;
    const handleMouseDown = () => { isMouseDown = true; };
    const handleMouseUp = () => { isMouseDown = false; };
    
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("touchend", handleMouseUp)

    class Particle {
      x: number
      y: number
      size: number
      baseSize: number
      speedX: number
      speedY: number
      color: string
      baseSpeedX: number
      baseSpeedY: number
      angle: number
      rotationSpeed: number
      shape: ParticleShape

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.baseSize = randomizeSizes ? Math.random() * particleSize * 2 + 1 : particleSize
        if (isLargeScreen.current) {
          this.baseSize *= 1.5
        }
        this.size = this.baseSize
        this.baseSpeedX = Math.random() * (particleSpeed * 2) - particleSpeed
        this.baseSpeedY = Math.random() * (particleSpeed * 2) - particleSpeed
        this.speedX = this.baseSpeedX
        this.speedY = this.baseSpeedY
        const themeColors = colorThemes[colorThemeKey].colors
        this.color = themeColors[Math.floor(Math.random() * themeColors.length)]
        this.angle = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.02
        this.shape = particleShapeKey
      }

      update() {
        this.normalPhysics()
        this.x += this.speedX
        this.y += this.speedY

        if (this.x < 0) this.x = canvas!.width
        if (this.x > canvas!.width) this.x = 0
        if (this.y < 0) this.y = canvas!.height
        if (this.y > canvas!.height) this.y = 0

        this.angle += this.rotationSpeed
      }

      normalPhysics() {
        const dx = this.x - mouseX
        const dy = this.y - mouseY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          const angle = Math.atan2(dy, dx)
          const force = (150 - distance) / 10
          this.speedX += Math.cos(angle) * force * 0.009
          this.speedY += Math.sin(angle) * force * 0.009
        }

        const maxSpeed = particleSpeed * 2
        this.speedX = Math.max(-maxSpeed, Math.min(maxSpeed, this.speedX))
        this.speedY = Math.max(-maxSpeed, Math.min(maxSpeed, this.speedY))

        this.speedX = this.speedX * 0.98 + this.baseSpeedX * 0.02
        this.speedY = this.speedY * 0.98 + this.baseSpeedY * 0.02
      }

      draw() {
        ctx!.fillStyle = this.color
        this.drawCircle()
      }

      drawCircle() {
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    let particles: Particle[] = []

    const createParticles = () => {
      particles = []
      const baseCount = particleCount
      const actualParticleCount = isLargeScreen.current ? baseCount * 1.5 : baseCount

      for (let i = 0; i < actualParticleCount; i++) {
        particles.push(new Particle())
      }
    }

    createParticles()

    const animate = () => {
      ctx!.fillStyle = isDarkMode ? "rgba(10, 10, 20, 0.8)" : "rgba(240, 240, 255, 0.8)"
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      if (showConnections) {
        let connectionCount = 0
        const maxConnections = 5000

        for (let i = 0; i < particles.length && connectionCount < maxConnections; i++) {
          const checkLimit = isLargeScreen.current ? 25 : 15
          for (
            let j = i + 1;
            j < Math.min(particles.length, i + checkLimit) && connectionCount < maxConnections;
            j++
          ) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < connectionDistance) {
              const opacity = 1 - distance / connectionDistance
              ctx!.strokeStyle = isDarkMode
                ? `rgba(150, 150, 255, ${opacity * 0.15})`
                : `rgba(70, 70, 150, ${opacity * 0.15})`
              ctx!.lineWidth = 0.5
              ctx!.beginPath()
              ctx!.moveTo(particles[i].x, particles[i].y)
              ctx!.lineTo(particles[j].x, particles[j].y)
              ctx!.stroke()
              connectionCount++
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    // New logic for pausing/resuming animation based on isModalOpen
    if (isModalOpen) {
      // Si un modal está abierto, detenemos la animación
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    } else {
      // Si no hay modales abiertos, nos aseguramos de que la animación corra
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      window.removeEventListener("mousemove", updateMousePosition)
      window.removeEventListener("touchmove", updateTouchPosition)
      window.removeEventListener("touchstart", updateTouchPosition)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchend", handleMouseUp)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isDarkMode, isModalOpen]) // Add isModalOpen to dependencies

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "absolute top-0 left-0 w-full h-full -z-10 transition-all duration-300",
        isModalOpen && "blur-sm scale-105"
      )}
    />
  )
} 