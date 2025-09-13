import { PrismaClient } from '@prisma/client';

/**
 * Instancia única global de PrismaClient siguiendo el patrón Singleton
 * Esto garantiza que solo exista una conexión a la base de datos
 * en toda la aplicación, evitando el agotamiento de conexiones.
 */
const prisma = new PrismaClient();

// Manejo de eventos del ciclo de vida
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

export default prisma;
