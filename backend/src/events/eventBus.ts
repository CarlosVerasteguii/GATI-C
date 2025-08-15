import { EventEmitter } from 'events';

/**
 * Event Bus singleton que implementa el patrón Mediator
 * para la comunicación desacoplada entre módulos del sistema GATI-C
 * 
 * Este patrón cumple con el requisito del SRS de "Monolito Modular"
 * con comunicación desacoplada a través de un Event Bus.
 */
class EventBus extends EventEmitter {
    private static instance: EventBus;

    private constructor() {
        super();

        // Configurar límites para evitar memory leaks
        this.setMaxListeners(50);
    }

    public static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    /**
     * Emite un evento con logging para debugging
     */
    public override emit(event: string, ...args: any[]): boolean {
        console.log(`[EventBus] Emitting event: ${event}`, args);
        return super.emit(event, ...args);
    }
}

export const eventBus = EventBus.getInstance();

/**
 * Definición de eventos del sistema para evitar "magic strings"
 * y proporcionar autocompletado en TypeScript
 */
export const AppEvents = {
    // Eventos de autenticación
    USER_LOGGED_IN: 'user:loggedIn',
    USER_LOGGED_OUT: 'user:loggedOut',
    USER_REGISTERED: 'user:registered',

    // Eventos de auditoría
    AUDIT_EVENT_CREATED: 'audit:created',
    AUDIT_EVENT_UPDATED: 'audit:updated',

    // Eventos de inventario
    PRODUCT_CREATED: 'product:created',
    PRODUCT_UPDATED: 'product:updated',
    PRODUCT_DELETED: 'product:deleted',

    // Eventos de tareas
    TASK_CREATED: 'task:created',
    TASK_UPDATED: 'task:updated',
    TASK_COMPLETED: 'task:completed',

    // Eventos de documentos
    DOCUMENT_UPLOADED: 'document:uploaded',
    DOCUMENT_DELETED: 'document:deleted'
} as const;

/**
 * Tipos para los datos de los eventos
 */
export interface UserEventData {
    userId: string;
    userEmail?: string;
    userRole?: string;
    timestamp?: Date;
}

export interface AuditEventData {
    userId: string;
    action: string;
    targetType: string;
    targetId: string;
    changes: any;
}

export interface ProductEventData {
    productId: string;
    productName: string;
    userId: string;
    changes?: any;
}

export interface TaskEventData {
    taskId: string;
    taskType: string;
    userId: string;
    status: string;
    details?: any;
}

export interface DocumentEventData {
    documentId: string;
    productId: string;
    filename: string;
    userId: string;
}
