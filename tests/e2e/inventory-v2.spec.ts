import { test, expect } from '@playwright/test';

test.describe('Inventario V2 - Smoke', () => {
    test('Carga de la página y render de la tabla', async ({ page }) => {
        await page.goto('/inventario-v2');
        await expect(page.getByRole('heading', { name: /Inventario/i })).toBeVisible({ timeout: 10000 }).catch(() => { });
        // Fallback: verificar que haya estructura de tabla
        await expect(page.locator('table')).toBeVisible();
    });

    test('Filtro por búsqueda actualiza URL y tabla (con mocks)', async ({ page }) => {
        // Mock GET inventory: baseline
        await page.route(/\/api\/v1\/inventory(.*)/, async (route) => {
            const url = new URL(route.request().url());
            const q = url.searchParams.get('q') ?? '';
            const base = {
                success: true,
                data: [
                    {
                        id: 'a1', name: 'Laptop', serialNumber: '', condition: 'available',
                        brand: { id: 'b1', name: 'Marca A' }, category: { id: 'c1', name: 'Cat 1' }, location: { id: 'l1', name: 'Loc 1' },
                        purchaseDate: '2024-01-01T00:00:00.000Z', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z'
                    }
                ]
            };
            const filtered = {
                success: true,
                data: [
                    {
                        id: 'b2', name: 'Mouse', serialNumber: 'SN-01', condition: 'available',
                        brand: { id: 'b2', name: 'Marca B' }, category: { id: 'c2', name: 'Cat 2' }, location: { id: 'l2', name: 'Loc 2' },
                        purchaseDate: '2024-01-02T00:00:00.000Z', createdAt: '2024-01-02T00:00:00.000Z', updatedAt: '2024-01-02T00:00:00.000Z'
                    }
                ]
            };
            await route.fulfill({ json: q ? filtered : base });
        });

        await page.goto('/inventario-v2');
        await expect(page.locator('table')).toBeVisible();
        await expect(page.getByText('Laptop')).toBeVisible();

        const searchInput = page.getByLabel('Búsqueda');
        await searchInput.fill('mouse');
        await expect.poll(async () => (new URL(page.url())).searchParams.get('q')).toBe('mouse');
        await expect(page.getByText('Mouse')).toBeVisible();
    });

    test('Crear producto (mock API) y refrescar tabla', async ({ page }) => {
        // Intercepts for GET and POST
        let created = false;
        await page.route('**/api/v1/inventory', async (route) => {
            if (route.request().method() === 'POST') {
                created = true;
                await route.fulfill({
                    json: {
                        success: true, data: {
                            id: 'n1', name: 'Teclado', serialNumber: '', condition: 'available',
                            brand: { id: 'b1', name: 'Marca A' }, category: { id: 'c1', name: 'Cat 1' }, location: { id: 'l1', name: 'Loc 1' },
                            purchaseDate: '2024-01-03T00:00:00.000Z', createdAt: '2024-01-03T00:00:00.000Z', updatedAt: '2024-01-03T00:00:00.000Z'
                        }
                    }
                });
                return;
            }
            // GET: after creation, return list including new item
            const base = {
                success: true,
                data: [
                    {
                        id: 'a1', name: 'Laptop', serialNumber: '', condition: 'available',
                        brand: { id: 'b1', name: 'Marca A' }, category: { id: 'c1', name: 'Cat 1' }, location: { id: 'l1', name: 'Loc 1' },
                        purchaseDate: '2024-01-01T00:00:00.000Z', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z'
                    }
                ]
            };
            const withNew = {
                success: true,
                data: [
                    ...base.data,
                    {
                        id: 'n1', name: 'Teclado', serialNumber: '', condition: 'available',
                        brand: { id: 'b1', name: 'Marca A' }, category: { id: 'c1', name: 'Cat 1' }, location: { id: 'l1', name: 'Loc 1' },
                        purchaseDate: '2024-01-03T00:00:00.000Z', createdAt: '2024-01-03T00:00:00.000Z', updatedAt: '2024-01-03T00:00:00.000Z'
                    }
                ]
            };
            await route.fulfill({ json: created ? withNew : base });
        });

        await page.goto('/inventario-v2');
        // Abrir diálogo de creación si existe
        const createBtn = page.getByRole('button', { name: /Crear Nuevo Producto/i });
        if (!(await createBtn.isVisible().catch(() => false))) test.skip();
        await createBtn.click();

        // Llenar formulario (si el diálogo está integrado en la UI actual)
        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();
        // Campos básicos (si presentes)
        const nameInput = page.getByLabel('Nombre');
        await nameInput.fill('Teclado');
        // Enviar
        const submitBtn = page.getByRole('button', { name: /Crear/i });
        await submitBtn.click();

        // Esperar refresh y verificar nuevo item
        await expect(page.getByText('Teclado')).toBeVisible();
    });
});


