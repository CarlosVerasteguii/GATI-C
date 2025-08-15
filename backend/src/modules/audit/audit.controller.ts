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
     * Placeholder para futuras implementaciones de auditoría
     */
    async getAuditPlaceholder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(501).json({
                success: false,
                error: {
                    code: 'NOT_IMPLEMENTED',
                    message: 'Funcionalidad de auditoría no implementada aún'
                }
            });
        } catch (error) {
            next(error);
        }
    }
}
