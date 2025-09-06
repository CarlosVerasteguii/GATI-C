import { test, expect, Page, Locator, request as pwRequest } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const authFile = 'playwright/.auth/user.json';
const VALID_EDITOR = { email: 'editor@test.com', password: 'password123' };
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
  throw new Error('Backend did not become healthy in time (setup test).');
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

async function uiLogin(page: Page, creds: { email: string; password: string }) {
  await page.goto('/login');
  const maybeForm = loginForm(page);
  const scope = (await maybeForm.count()) ? maybeForm : page.locator('body');
  const emailInput = await findUsernameInput(scope);
  const passwordInput = await findPasswordInput(scope);

  await emailInput.first().fill(creds.email);
  await passwordInput.first().fill(creds.password);

  const submit = ((await maybeForm.count()) ? maybeForm : page).locator('button[type="submit"]').first();
  await Promise.all([
    page.waitForURL('**/dashboard', { timeout: 15000, waitUntil: 'domcontentloaded' }),
    submit.click(),
  ]);
}

test('authenticate', async ({ page, request }) => {
  // 0) Ensure backend is up and test user exists
  await waitForBackendHealth(request);
  const reg = await request.post(`${API}/api/v1/auth/register`, {
    data: {
      name: 'Test Editor',
      email: VALID_EDITOR.email,
      password: VALID_EDITOR.password,
    },
  });
  if (![200, 201, 409].includes(reg.status())) {
    throw new Error(`Failed to register test user in setup: ${reg.status()} - ${await reg.text()}`);
  }

  // 1) UI login
  await uiLogin(page, VALID_EDITOR);

  // 2) Validate success: dashboard URL and user identity in UI
  await expect(page).toHaveURL(/\/dashboard/i);
  await expect(
    page.getByRole('button', { name: /Test Editor|Profile|Perfil|Cuenta/i })
  ).toBeVisible();

  // 3) Validate presence of JWT cookie in the browser context
  const cookies = await page.context().cookies();
  expect(cookies.some(c => c.name === 'jwt')).toBe(true);

  // 4) Persist storage state for dependent projects
  await fs.promises.mkdir(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
