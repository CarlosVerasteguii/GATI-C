import { User } from '@prisma/client';

export type RegisterUserData = {
    name: string;
    email: string;
    password: string;
};

export type LoginUserData = {
    email: string;
    password: string;
};

export type AuthResult = {
    user: Omit<User, 'password_hash'>;
    token: string;
};
