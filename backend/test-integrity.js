const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testReferentialIntegrity() {
    try {
        console.log('🧪 Iniciando prueba de integridad referencial...');

        // 1. Crear un User
        console.log('📝 Creando usuario de prueba...');
        const user = await prisma.user.create({
            data: {
                name: 'Usuario de Prueba',
                email: 'test@example.com',
                password_hash: 'hash_temporal',
                role: 'LECTOR'
            }
        });
        console.log('✅ Usuario creado:', user.id);

        // 2. Crear un AuditLog asociado a ese User
        console.log('📝 Creando registro de auditoría...');
        const auditLog = await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'TEST_ACTION',
                target_type: 'TEST_TARGET',
                target_id: 'test-123',
                changes_json: { test: 'data' }
            }
        });
        console.log('✅ Registro de auditoría creado:', auditLog.id);

        // 3. Intentar eliminar el User (esto debería fallar)
        console.log('❌ Intentando eliminar usuario con registros dependientes...');
        await prisma.user.delete({
            where: { id: user.id }
        });

        console.log('❌ ERROR: La eliminación no debería haber sido exitosa');
    } catch (error) {
        console.log('✅ ERROR ESPERADO capturado:');
        console.log('Tipo de error:', error.constructor.name);
        console.log('Mensaje:', error.message);

        if (error.code) {
            console.log('Código de error Prisma:', error.code);
        }

        // Verificar que es un error de restricción de clave externa
        if (error.message && error.message.includes('foreign key constraint')) {
            console.log('🎯 INTEGRIDAD REFERENCIAL FUNCIONANDO: Error de restricción de clave externa capturado');
        } else {
            console.log('⚠️ ADVERTENCIA: Error capturado pero no es de restricción de clave externa');
        }
    } finally {
        // Limpiar datos de prueba
        try {
            console.log('🧹 Limpiando datos de prueba...');
            await prisma.auditLog.deleteMany({
                where: { userId: { contains: 'test' } }
            });
            await prisma.user.deleteMany({
                where: { email: 'test@example.com' }
            });
            console.log('✅ Datos de prueba limpiados');
        } catch (cleanupError) {
            console.log('⚠️ Error durante limpieza:', cleanupError.message);
        }

        await prisma.$disconnect();
    }
}

testReferentialIntegrity();
