import 'reflect-metadata';
import { container } from 'tsyringe';
import { AuthService } from '../modules/auth/auth.service.js';
import prisma from '../config/prisma.js';
import { RegisterUserData } from '../types/auth.types.js';

/**
 * Script de Smoke Test para verificar la integración básica del backend
 * Prueba el flujo completo de registro de usuario contra la base de datos real
 */
async function main() {
    console.log('🚀 --- Iniciando Smoke Test del Backend ---');
    console.log('📊 Probando integración con base de datos MySQL via Prisma...');

    // Resolver AuthService desde el contenedor de tsyringe
    const authService = container.resolve(AuthService);
    console.log('✅ AuthService resuelto exitosamente desde el contenedor IoC');

    // Datos de prueba para el usuario
    const testUserData: RegisterUserData = {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        password: 'password123',
    };

    console.log('👤 Datos de prueba:', {
        email: testUserData.email,
        name: testUserData.name,
        password: '[PROTECTED]'
    });

    try {
        console.log('🔐 Intentando registrar nuevo usuario...');
        const result = await authService.registerUser(testUserData);

        console.log('✅ Éxito: Usuario registrado exitosamente');
        console.log('👤 Usuario creado:', {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
            isActive: result.user.isActive,
            createdAt: result.user.createdAt
        });
        console.log('🔑 Token JWT generado:', result.token.substring(0, 50) + '...');

        console.log('🔍 Verificando persistencia en la base de datos...');
        const dbUser = await prisma.user.findUnique({
            where: { email: testUserData.email }
        });

        if (dbUser) {
            console.log('✅ Verificación en DB exitosa:');
            console.log('👤 Usuario encontrado en DB:', {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                role: dbUser.role,
                isActive: dbUser.isActive,
                createdAt: dbUser.createdAt
            });

            // Verificar que el hash de contraseña esté presente pero no sea el mismo que la original
            if (dbUser.passwordHash && dbUser.passwordHash !== testUserData.password) {
                console.log('🔒 Hash de contraseña correctamente almacenado y hasheado');
            } else {
                throw new Error('El hash de contraseña no se almacenó correctamente');
            }

            console.log('🎉 ¡Smoke Test PASADO! El backend puede crear y persistir usuarios correctamente.');

        } else {
            throw new Error('El usuario no se encontró en la base de datos después del registro.');
        }

    } catch (error) {
        console.error('❌ Error en el Smoke Test:', error);

        // Información adicional para debugging
        if (error instanceof Error) {
            console.error('📋 Detalles del error:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
        }

        // Verificar estado de la conexión a la base de datos
        try {
            await prisma.$queryRaw`SELECT 1 as test`;
            console.log('✅ La conexión a la base de datos está funcionando');
        } catch (dbError) {
            console.error('❌ Error de conexión a la base de datos:', dbError);
        }

        process.exit(1);

    } finally {
        console.log('🔌 Desconectando de la base de datos...');
        await prisma.$disconnect();
        console.log('--- Smoke Test Finalizado ---');
    }
}

// Ejecutar el script si se llama directamente
main().catch((error) => {
    console.error('❌ Error fatal en el script:', error);
    process.exit(1);
});

export default main;
