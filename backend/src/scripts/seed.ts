import '../config/env.js';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import { UserRole } from '@prisma/client';

/**
 * Seed de datos de desarrollo para usuarios.
 * - Idempotente: utiliza upsert por email
 * - Aislado: no toca la lógica de negocio del AuthService
 */
async function main() {
  console.log('🌱 Iniciando seeding de usuarios de desarrollo...');

  const devUsers: Array<{
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isActive?: boolean;
  }> = [
    {
      name: 'Carlos Vera (DEV)',
      email: 'carlos@example.com',
      password: 'password123',
      role: UserRole.ADMINISTRADOR,
      isActive: true,
    },
    {
      name: 'Ana López (DEV)',
      email: 'ana@example.com',
      password: 'password123',
      role: UserRole.EDITOR,
      isActive: true,
    },
    {
      name: 'Pedro García (DEV)',
      email: 'pedro@example.com',
      password: 'password123',
      role: UserRole.LECTOR,
      isActive: true,
    },
  ];

  for (const u of devUsers) {
    const hashed = await bcrypt.hash(u.password, 12);
    await prisma.user
      .upsert({
        where: { email: u.email },
        update: {
          name: u.name,
          role: u.role,
          isActive: u.isActive ?? true,
        },
        create: {
          name: u.name,
          email: u.email,
          password_hash: hashed,
          role: u.role,
          isActive: u.isActive ?? true,
        },
      })
      .then(() => {
        console.log(`✅ Usuario '${u.email}' asegurado con rol '${u.role}'.`);
      })
      .catch((err) => {
        console.error(`❌ Error al asegurar usuario '${u.email}':`, err);
        throw err;
      });
  }

  console.log('✅ Seeding completado.');
}

main()
  .catch((err) => {
    console.error('❌ Falló el seeding:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
