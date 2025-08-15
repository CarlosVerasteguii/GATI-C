import { Prisma, PrismaClient } from '@prisma/client';
import { singleton } from 'tsyringe';
import prisma from '../../config/prisma.js';

export interface AuditLogData {
    userId: string;
    action: string;
    targetType: string;
    targetId: string;
    changes: object;
}

// Este tipo complejo es la forma correcta de tipar un cliente de transacción de Prisma
type PrismaTransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

@singleton()
export class AuditService {
    public async log(data: AuditLogData): Promise<void> {
        // Placeholder para futuras llamadas no transaccionales
        return this.logTransactional(prisma, data);
    }

    public async logTransactional(
        tx: PrismaTransactionClient,
        data: AuditLogData
    ): Promise<void> {
        await tx.auditLog.create({
            data: {
                userId: data.userId,
                action: data.action,
                target_type: data.targetType,
                target_id: data.targetId,
                changes_json: data.changes as unknown as Prisma.InputJsonValue,
            },
        });
        console.log(`Audit log created for action: ${data.action}`);
    }
}
