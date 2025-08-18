import { Prisma } from '@prisma/client';
import { singleton } from 'tsyringe';
import prisma from '../../config/prisma.js';

export interface AuditLogData {
    userId: string;
    action: string;
    targetType: string;
    targetId: string;
    changes: object;
}

@singleton()
export class AuditService {
    public async log(data: AuditLogData): Promise<void> {
        try {
            await prisma.auditLog.create({
                data: {
                    userId: data.userId,
                    action: data.action,
                    target_type: data.targetType,
                    target_id: data.targetId,
                    changes_json: data.changes as unknown as Prisma.InputJsonValue,
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
