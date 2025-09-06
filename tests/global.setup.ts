import { chromium, request as pwRequest, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const API = process.env.API_BASE ?? 'http://localhost:3001';
const VALID_EDITOR = { email: 'editor@test.com', password: 'password123' };
const STATE_PATH = path.join('playwright', '.auth', 'user.json');

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
  throw new Error('Backend did not become healthy in time (global setup).');
}

export default async function globalSetup(config: FullConfig) {
  // Ensure output directory exists
  await fs.promises.mkdir(path.dirname(STATE_PATH), { recursive: true });

  const request = await pwRequest.newContext();

  // 1) Wait for backend API to be healthy
  await waitForBackendHealth(request, 90_000);

  // 2) Seed or ensure test user exists
  const reg = await request.post(`${API}/api/v1/auth/register`, {
    data: {
      name: 'Test Editor',
      email: VALID_EDITOR.email,
      password: VALID_EDITOR.password,
    },
  });
  if (![200, 201, 409].includes(reg.status())) {
    throw new Error(`Failed to register test user in global setup: ${reg.status()} - ${await reg.text()}`);
  }

  // 3) Perform API login to obtain auth cookie (shared cookie domain: localhost)
  const login = await request.post(`${API}/api/v1/auth/login`, {
    data: { email: VALID_EDITOR.email, password: VALID_EDITOR.password },
  });
  if (!login.ok()) {
    throw new Error(`Global setup login failed: ${login.status()} - ${await login.text()}`);
  }

  // 4) Persist storage state (cookies) for all tests to reuse
  const state = await request.storageState();
  await fs.promises.writeFile(STATE_PATH, JSON.stringify(state, null, 2), 'utf-8');

  // Optionally validate UI cookie loading by opening a context with the saved state
  // This is a quick sanity check, but non-fatal if it fails
  try {
    const baseURL = (config.projects?.[0]?.use as any)?.baseURL as string | undefined;
    if (baseURL) {
      const browser = await chromium.launch();
      const context = await browser.newContext({ storageState: STATE_PATH });
      const page = await context.newPage();
      await page.goto(baseURL + '/dashboard');
      await context.storageState({ path: STATE_PATH }); // rewrite state in unified format
      await browser.close();
    }
  } catch {
    // ignore validation errors in global setup
  }
}
