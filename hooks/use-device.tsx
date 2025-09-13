"use client"

import { useState, useEffect } from "react"

// Definición de tamaños de breakpoint según Tailwind CSS por defecto
const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
}

type DeviceType = "mobile" | "tablet" | "desktop"

interface DeviceInfo {
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
    deviceType: DeviceType
    width: number
    height: number
    orientation: "portrait" | "landscape"
}

/**
 * Hook personalizado para detectar información sobre el dispositivo actual
 * 
 * @returns {DeviceInfo} Objeto con información sobre el dispositivo
 * 
 * @example
 * ```tsx
 * const { isMobile, isTablet, isDesktop } = useDevice()
 * 
 * return (
 *   <div>
 *     {isMobile && <MobileView />}
 *     {isTablet && <TabletView />}
 *     {isDesktop && <DesktopView />}
 *   </div>
 * )
 * ```
 */
export function useDevice(): DeviceInfo {
    // Valores iniciales para SSR
    const defaultValues: DeviceInfo = {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        deviceType: "desktop",
        width: 0,
        height: 0,
        orientation: "landscape",
    }

    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(defaultValues)

    useEffect(() => {
        // Función para actualizar la información del dispositivo
        const updateDeviceInfo = () => {
            const width = window.innerWidth
            const height = window.innerHeight
            const orientation = height > width ? "portrait" : "landscape"

            // Determinar el tipo de dispositivo según el ancho
            let deviceType: DeviceType = "desktop"
            let isMobile = false
            let isTablet = false
            let isDesktop = false

            if (width < BREAKPOINTS.md) {
                deviceType = "mobile"
                isMobile = true
            } else if (width < BREAKPOINTS.lg) {
                deviceType = "tablet"
                isTablet = true
            } else {
                deviceType = "desktop"
                isDesktop = true
            }

            setDeviceInfo({
                isMobile,
                isTablet,
                isDesktop,
                deviceType,
                width,
                height,
                orientation,
            })
        }

        // Ejecutar inicialmente
        updateDeviceInfo()

        // Configurar listener para cambios de tamaño
        window.addEventListener("resize", updateDeviceInfo)

        // Limpiar listener al desmontar
        return () => {
            window.removeEventListener("resize", updateDeviceInfo)
        }
    }, [])

    return deviceInfo
}

export default useDevice 