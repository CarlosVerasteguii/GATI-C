import { JWTPayload } from 'jose';

declare global {
    namespace Express {
        interface Request {
            user?: string | JWTPayload;
        }
    }
}
