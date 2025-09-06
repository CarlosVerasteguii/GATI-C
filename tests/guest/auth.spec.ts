import { test, expect, Page, Locator, request as pwRequest } from '@playwright/test';

const DEBUG = process.env.DEBUG_E2E === '1';
const VALID_EDITOR = { email: 'editor@test.com', password: 'password123' };
const INVALID_USER = { email: 'invalid@test.com', password: 'wrongpassword' };

// Utilidades de nivel de módulo
const API = process.env.API_BASE ?? 'http://localhost:3001';

async function waitForBackendHealth(request: pwRequest.APIRequestContext, timeoutMs = 90_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await request.get(`${API}/api/v1/health`);
      if (res.ok()) return;
    } catch {
      // ignore and retry
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error('Backend did not become healthy in time (guest tests).');
}

function loginForm(page: Page): Locator {
  const formWithUsername = page.locator('form').filter({
    has: page.getByLabel(/Usuario/i),
  });
  return formWithUsername.first();
}

async function findUsernameInput(scope: Locator): Promise<Locator> {
  // Prioridad 1: Buscar por la etiqueta "Usuario"
  const byLabel = scope.getByLabel(/Usuario/i);
  if (await byLabel.count() > 0) return byLabel.first();

  // Fallbacks
  const byId = scope.locator('#username');
  if (await byId.count() > 0) return byId.first();

  const byName = scope.locator('[name="username"]');
  if (await byName.count() > 0) return byName.first();

  throw new Error('Username input not found using stable selectors');
}

async function findPasswordInput(scope: Locator): Promise<Locator> {
  // Preferir selector semántico por etiqueta visible
  const byLabel = scope.getByLabel(/Contraseña/i);
  if (await byLabel.count() > 0) return byLabel.first();

  const byName = scope.locator('[name="password"]');
  if (await byName.count() > 0) return byName.first();

  const byType = scope.locator('[type="password"]');
  if (await byType.count() > 0) return byType.first();

  const byId = scope.locator('#password');
  if (await byId.count() > 0) return byId.first();

  throw new Error('Password input not found using stable selectors');
}

test.beforeEach(async ({ page }) => {
  if (DEBUG) {
    page.on('request', request => console.log('>> REQ:', request.method(), request.url()));
    page.on('response', async response => console.log('<< RES:', response.status(), response.url()));
  }
});

test.describe('Authentication Flow (Guest)', () => {
  // Ensure guest (no preloaded storage state)
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should redirect unauthenticated users to login for protected routes', async ({ page }) => {
    await page.goto('/inventario');
    await expect(page).toHaveURL(/\/login(\?|$)/i);
  });

  test('should fail with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    const maybeForm = loginForm(page);
    const scope = (await maybeForm.count()) ? maybeForm : page.locator('body');
    await (await findUsernameInput(scope)).fill(INVALID_USER.email);
    await (await findPasswordInput(scope)).fill(INVALID_USER.password);

    const loginResponsePromise = page.waitForResponse(response =>
      response.url().endsWith('/api/v1/auth/login') && response.request().method() === 'POST'
    );
    await ((await maybeForm.count()) ? maybeForm : page).locator('button[type="submit"]').first().click();
    const loginResponse = await loginResponsePromise;
    expect(loginResponse.status()).toBe(401);

    await expect(page).toHaveURL(/\/login(\?|$)/i);
    await expect(page.getByText(/credenciales (inválidas|incorrectas)|invalid credentials/i)).toBeVisible({ timeout: 10000 });
  });

  test('should succeed with valid credentials and redirect to dashboard', async ({ page }) => {
    // Ensure backend is healthy and test user exists
    await waitForBackendHealth(page.request);
    const reg = await page.request.post(`${API}/api/v1/auth/register`, {
      data: { name: 'Test Editor', email: VALID_EDITOR.email, password: VALID_EDITOR.password },
    });
    if (![200, 201, 409].includes(reg.status())) {
      throw new Error(`Failed to register test user: ${reg.status()} - ${await reg.text()}`);
    }

    await page.goto('/login');

    const maybeForm = loginForm(page);
    const scope = (await maybeForm.count()) ? maybeForm : page.locator('body');
    await (await findUsernameInput(scope)).fill(VALID_EDITOR.email);
    await (await findPasswordInput(scope)).fill(VALID_EDITOR.password);

    await Promise.all([
      page.waitForURL('**/dashboard', { timeout: 15000, waitUntil: 'domcontentloaded' }),
      ((await maybeForm.count()) ? maybeForm : page).locator('button[type="submit"]').first().click(),
    ]);

    await expect(page).toHaveURL(/\/dashboard/i);
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Test Editor|Profile|Perfil|Cuenta/i })).toBeVisible();
    await expect(page.getByText(/credenciales (inválidas|incorrectas)|invalid credentials/i)).not.toBeVisible();
  });
});
