import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno PRIMERO, antes que cualquier otra cosa
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Aquí podríamos añadir validación con Zod en el futuro.
// Por ahora, solo asegura que dotenv se ejecute primero.
