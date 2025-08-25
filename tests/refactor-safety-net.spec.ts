import { test, expect, Page } from '@playwright/test';

const API = process.env.API_BASE ?? 'http://localhost:3001';

// Credenciales de prueba (hardcoded para la red de seguridad)
const VALID_EDITOR = { email: 'editor@test.com', password: 'password123' };
const INVALID_USER = { email: 'invalid@test.com', password: 'wrongpassword' };

// Helper: completa campos por label o placeholder usando selectores semánticos
async function fillByLabelOrPlaceholder(page: Page, opts: { label: RegExp; placeholder: RegExp; value: string }) {
    // Prioritize specific IDs for known fields like username/email and password
    if (opts.label.source.includes('email') || opts.placeholder.source.includes('email') || opts.label.source.includes('usuario')) {
        const usernameInput = page.locator('input#username').first();
        if (await usernameInput.isVisible()) {
            await usernameInput.fill(opts.value);
            return;
        }
    }
    if (opts.label.source.includes('password') || opts.placeholder.source.includes('password') || opts.label.source.includes('contraseña')) {
        const passwordInput = page.locator('input#password').first();
        if (await passwordInput.isVisible()) {
            await passwordInput.fill(opts.value);
            return;
        }
    }

    // Fallback to getByLabel
    const byLabel = page.getByLabel(opts.label);
    if (await byLabel.count()) {
        await byLabel.fill(opts.value);
        return;
    }

    // Fallback to getByPlaceholder
    const byPlaceholder = page.getByPlaceholder(opts.placeholder);
    if (await byPlaceholder.count()) {
        await byPlaceholder.fill(opts.value);
        return;
    }

    throw new Error(`Input field with label '${opts.label.source}' or placeholder '${opts.placeholder.source}' not found.`);
}

test.beforeAll(async ({ request }) => {
    // 1. Esperar a que el backend esté saludable
    await expect.poll(async () => {
        try {
            const response = await request.get(`${API}/api/v1/health`);
            return response.ok();
        } catch (error) {
            console.warn('Backend health check failed, retrying...', error);
            return false;
        }
    }, {
        message: 'Backend did not become healthy in time.',
        timeout: 30000 // 30 seconds timeout
    }).toBe(true);

    // 2. Registrar un usuario de prueba (ej. editor@test.com)
    const reg = await request.post(`${API}/api/v1/auth/register`, {
        data: {
            name: 'Test Editor',
            email: VALID_EDITOR.email,
            password: VALID_EDITOR.password,
        },
    });

    if (![201, 409].includes(reg.status())) {
        throw new Error(`Failed to register test user: ${reg.status()} - ${await reg.text()}`);
    }
    console.log(`Test user ${VALID_EDITOR.email} registration: ${reg.status()}`);
});

// Navega a /login antes de cada prueba en este archivo
test.beforeEach(async ({ page }) => {
    // --- TELEMETRÍA DE RED ---
    page.on('request', request => console.log('>> REQ:', request.method(), request.url()));
    page.on('response', async response => console.log('<< RES:', response.status(), response.url()));
    // -------------------------

    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded'); // Wait for DOM to be loaded
    await expect(page).toHaveURL(/login/i);
});

test.describe('GATI-C Safety Net - E2E Pragmático', () => {
    test.describe('Authentication Flow', () => {
        test('should fail with invalid credentials', async ({ page }) => {
            // Completar email y contraseña inválidos
            await fillByLabelOrPlaceholder(page, {
                label: /email|correo/i,
                placeholder: /email|correo/i,
                value: INVALID_USER.email,
            });
            await fillByLabelOrPlaceholder(page, {
                label: /password|contraseña/i,
                placeholder: /password|contraseña/i,
                value: INVALID_USER.password,
            });

            // Enviar formulario y esperar la respuesta de la API de login
            const loginPromise = page.waitForResponse(response =>
                response.url().includes('/api/v1/auth/login') && response.request().method() === 'POST'
            );
            await page.getByRole('button', { name: /iniciar sesión|login|entrar|sign in|acceder/i }).click();
            await loginPromise; // Esperar a que la respuesta de login llegue

            // Aserciones: seguimos en login y vemos un mensaje de error comprensible
            await expect(page).toHaveURL(/login|auth|signin/i);
            await expect(
                page.getByText(/credenciales (inválidas|incorrectas)|invalid credentials/i)
            ).toBeVisible({ timeout: 10000 }); // Aumentar timeout para visibilidad del mensaje de error
        });

        test('should succeed with valid credentials and redirect to dashboard', async ({ page }) => {
            // Completar email y contraseña válidos
            await fillByLabelOrPlaceholder(page, {
                label: /email|correo/i,
                placeholder: /email|correo/i,
                value: VALID_EDITOR.email,
            });
            await fillByLabelOrPlaceholder(page, {
                label: /password|contraseña/i,
                placeholder: /password|contraseña/i,
                value: VALID_EDITOR.password,
            });

            // Enviar formulario y esperar la redirección al dashboard
            await Promise.all([
                page.waitForURL('**/dashboard', { timeout: 15000, waitUntil: 'domcontentloaded' }),
                page.getByRole('button', { name: /iniciar sesión|login|entrar|sign in|acceder/i }).click(),
            ]);
            const context = page.context();
            const gotJwt = (await context.cookies()).some(c => c.name === 'jwt');
            expect(gotJwt).toBe(true);

            // Verificar redirección y presencia de elemento clave del dashboard
            await expect(page).toHaveURL(/dashboard/i);
            await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
        });
    });

    test.describe('Authenticated Flows', () => {
        // Realiza el login una vez para todas las pruebas dentro de este bloque 'describe'
        test.beforeEach(async ({ page }) => {
            await page.goto('/login'); // Asegurarse de estar en la página de login
            await fillByLabelOrPlaceholder(page, {
                label: /email|correo/i,
                placeholder: /email|correo/i,
                value: VALID_EDITOR.email,
            });
            await fillByLabelOrPlaceholder(page, {
                label: /password|contraseña/i,
                placeholder: /password|contraseña/i,
                value: VALID_EDITOR.password,
            });
            await Promise.all([
                page.waitForURL('**/dashboard', { timeout: 15000, waitUntil: 'domcontentloaded' }),
                page.getByRole('button', { name: /iniciar sesión|login|entrar|sign in|acceder/i }).click(),
            ]);
            const context = page.context();
            const gotJwt = (await context.cookies()).some(c => c.name === 'jwt');
            expect(gotJwt).toBe(true);

            await expect(page).toHaveURL(/dashboard/i); // Verificar que la redirección al dashboard fue exitosa
        });

        test('should allow access to the inventory page and detect Spanish nomenclature', async ({ page }) => {
            // Navegar a Inventario (ya estamos logueados por el beforeEach)
            await page.goto('/inventario');
            await expect(page).toHaveURL(/inventario/i);

            // Aserciones explícitas sobre textos en español (cabeceras de tabla y elementos de UI)
            // Se mantienen las verificaciones existentes para la red de seguridad.
            await expect(page.getByRole('columnheader', { name: /nombre/i })).toBeVisible();
            await expect(page.getByRole('columnheader', { name: /marca/i })).toBeVisible();
            await expect(page.getByRole('columnheader', { name: /categoría/i })).toBeVisible();
            await expect(page.getByRole('columnheader', { name: /estado/i })).toBeVisible();
            await expect(page.getByRole('columnheader', { name: /cantidad/i })).toBeVisible();

            // Elementos adicionales en español que deberían existir en la UI actual
            await expect(page.getByRole('button', { name: /añadir|agregar/i })).toBeVisible();
            await expect(page.getByRole('heading', { name: /inventario/i })).toBeVisible();
        });
    });
});
