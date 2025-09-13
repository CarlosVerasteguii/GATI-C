# Script de reseteo para el proyecto GATI-C
# Ejecutar en PowerShell como administrador si es necesario

Write-Host "🧹 Limpiando el entorno del proyecto GATI-C..." -ForegroundColor Cyan

# Detener procesos de Node.js
Write-Host "📌 Deteniendo procesos de Node.js..." -ForegroundColor Yellow
taskkill /f /im node.exe 2> $null

# Limpiar caché de npm
Write-Host "📌 Limpiando caché de npm..." -ForegroundColor Yellow
npm cache clean --force

# Eliminar directorios y archivos problemáticos
Write-Host "📌 Eliminando node_modules..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

Write-Host "📌 Eliminando .next..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

Write-Host "📌 Eliminando archivos de bloqueo..." -ForegroundColor Yellow
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force pnpm-lock.yaml -ErrorAction SilentlyContinue
Remove-Item -Force yarn.lock -ErrorAction SilentlyContinue

# Reinstalar dependencias
Write-Host "📌 Reinstalando dependencias..." -ForegroundColor Yellow
npm install --legacy-peer-deps

# Iniciar el servidor de desarrollo
$startServer = Read-Host "¿Deseas iniciar el servidor de desarrollo? (s/n)"

if ($startServer -eq "s") {
    Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Green
    npm run dev
}
else {
    Write-Host "✅ Limpieza completa. Ejecuta 'npm run dev' cuando estés listo." -ForegroundColor Green
}

Write-Host "¡Proceso completado! 🎉" -ForegroundColor Cyan 