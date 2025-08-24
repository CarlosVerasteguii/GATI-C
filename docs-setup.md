# Setup and Troubleshooting Documentation - GATI-C

## 1. Initial Diagnosis

### Issues detected:

1. **Dependency and npm package errors:**
   - Multiple warnings of `npm warn ERESOLVE overriding peer dependency`
   - Error: `Cannot read properties of null (reading 'matches')`
   - These problems can cause incomplete installations or inconsistent behavior

2. **Next.js initialization issues:**
   - Compilation sometimes only starts when manually accessing localhost:3000
   - Permission error: `[Error: EPERM: operation not permitted, open '.next/trace']`
   - Port 3000 already in use (using 3001 instead)

3. **Duplicate route error** (added later):
   - Error: `You cannot have two parallel pages that resolve to the same path`
   - Two different files attempted to serve the same `/dashboard` route:
     - `app/dashboard/page.tsx`
     - `app/(app)/dashboard/page.tsx`

## 2. Solutions implemented

### 2.1 Runtime environment cleanup
- Stopped all running Node.js processes (`taskkill /f /im node.exe`)
- Cleared npm cache (`npm cache clean --force`)
- Removed problematic directories:
  - `node_modules`: To avoid corrupt or incomplete dependencies
  - `.next`: To avoid build and cache issues
- Deleted the `pnpm-lock.yaml` file to avoid conflicts between package managers

### 2.2 Dependency installation
- Clean reinstall of dependencies using npm with the `--legacy-peer-deps` option to avoid compatibility issues
- Created `.env.local` file with basic settings, including port 3001 as an alternative
- Successful execution of the development server (`npm run dev`) - server listening on port 3000

### 2.3 Project structure and route resolution
- Analysis of folder structure and Next.js App Router routes
- Identification of duplicate files pointing to the same route
- Deleted `app/dashboard/page.tsx` to resolve route conflict with `app/(app)/dashboard/page.tsx`
- Corrected syntax errors in components

### 2.4 Results
- ✅ Dependency issues resolved
- ✅ Installation errors removed
- ✅ Next.js server starts correctly
- ✅ Duplicate route conflict resolved
- ✅ Application accessible at http://localhost:3000

## 3. Future Troubleshooting Guide

### 3.1 Compilation problems or slow startup
If the application takes a long time to start or only compiles when accessed:
1. Stop all Node.js processes: `taskkill /f /im node.exe`
2. Remove the cache directory: `Remove-Item -Recurse -Force .next`
3. Restart the server: `npm run dev`

### 3.2 Dependency errors
If dependency-related errors appear:
1. Clear npm cache: `npm cache clean --force`
2. Remove node_modules: `Remove-Item -Recurse -Force node_modules`
3. Reinstall with the legacy option: `npm install --legacy-peer-deps`

### 3.3 Port in use
If the default port is in use:
1. Set an alternate port in `.env.local`: `PORT=3002`
2. Or run directly with a different port: `npm run dev -- -p 3002`

### 3.4 Permission errors
If EPERM or permission errors appear:
1. Run PowerShell as administrator
2. Ensure the user has full permissions on the project folder
3. Run the failing command with elevated privileges

### 3.5 Duplicate route errors
If the error "You cannot have two parallel pages that resolve to the same path" appears:
1. Identify which files are trying to serve the same route
2. Decide which to keep according to the project structure
3. Delete or rename one of the duplicate files
4. Keep in mind that in Next.js App Router:
   - Folders determine URL routes
   - Route groups (folders with parentheses like `(app)`) do not affect the URL

## 4. Development Recommendations

### 4.1 Package management
- **Always** use the same package manager (npm or pnpm, but do not mix)
- For this project, prefer npm with the `--legacy-peer-deps` option

### 4.2 Updates
- Update dependencies gradually, not all at once
- Test the application after each major update
- Keep the documentation file updated with any issue and solution

### 4.3 Development environment
- Use Node.js LTS (recommended version 18.x or 20.x)
- Ensure there are no orphaned Node.js processes before starting the server

### 4.4 Quick reset script
A PowerShell script (`reset-project.ps1`) has been created to facilitate project cleanup and reinstall:
- Stops all Node.js processes
- Clears npm cache
- Removes problematic directories (node_modules, .next)
- Deletes package lock files
- Reinstalls all dependencies with correct settings
- Offers to start the server automatically

To use it, run from PowerShell:
```
.\reset-project.ps1
```
