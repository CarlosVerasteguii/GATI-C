/**
 * Controlador de Auditoría - Placeholder para la refactorización
 * 
 * Este archivo es temporal y será implementado completamente
 * en la siguiente fase del desarrollo.
 */

import { Request, Response, NextFunction } from 'express';
import { AuditService } from './audit.service.js';

export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    /**
     * Obtiene el historial de auditoría para un usuario específico
     */
    async getUserAuditHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.params;

            if (!userId) {
                res.status(400).json({
                    success: false,
                    error: { message: 'userId es requerido' }
                });
                return;
            }

            const auditHistory = await this.auditService.getUserAuditHistory(userId);

            res.json({
                success: true,
                data: auditHistory
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Obtiene el historial de auditoría para un recurso específico
     */
    async getResourceAuditHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { targetType, targetId } = req.params;

            if (!targetType || !targetId) {
                res.status(400).json({
                    success: false,
                    error: { message: 'targetType y targetId son requeridos' }
                });
                return;
            }

            const auditHistory = await this.auditService.getResourceAuditHistory(targetType, targetId);

            res.json({
                success: true,
                data: auditHistory
            });
        } catch (error) {
            next(error);
        }
    }
}
