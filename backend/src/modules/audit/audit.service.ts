import { Prisma, PrismaClient } from '@prisma/client';
import { singleton } from 'tsyringe';
import prisma from '../../config/prisma.js';

type PrismaTransactionalClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export interface AuditLogData {
    userId: string;
    action: string;
    targetType: string;
    targetId: string;
    changes: object;
}

@singleton()
export class AuditService {
    public async logTransactional(tx: PrismaTransactionalClient, data: AuditLogData): Promise<void> {
        await tx.auditLog.create({
            data: {
                userId: data.userId,
                action: data.action,
                targetType: data.targetType,
                targetId: data.targetId,
                changesJson: data.changes as unknown as Prisma.InputJsonValue,
            },
        });
    }

    public async logNonTransactional(data: AuditLogData): Promise<void> {
        try {
            await prisma.auditLog.create({
                data: {
                    userId: data.userId,
                    action: data.action,
                    targetType: data.targetType,
                    targetId: data.targetId,
                    changesJson: data.changes as unknown as Prisma.InputJsonValue,
                },
            });
            console.log(`Audit log created for action: ${data.action}`);
        } catch (error) {
            // Siguiendo el principio de "Trazabilidad Sigue, no Lidera"
            // Los errores en auditoría no deben afectar la operación principal
            console.error(`Error al crear registro de auditoría para acción: ${data.action}`, error);
        }
    }
}
