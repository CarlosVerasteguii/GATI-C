import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../../../../../lib/api/endpoints/inventory';
import type { ListParams } from '../../../../../lib/api/schemas/inventory';
import * as client from '../../../../../lib/api/client';
import * as schemas from '../../../../../lib/api/schemas/inventory';
import type { Mock } from 'vitest';

// Mock dependencies
vi.mock('../../../../../lib/api/client');
vi.mock('../../../../../lib/api/schemas/inventory', async () => {
    const actual = await vi.importActual<any>('../../../../../lib/api/schemas/inventory');
    return {
        ...actual,
        // We mock only the transformers; keep ListParamsSchema real
        parseAndTransformProducts: vi.fn(),
        parseAndTransformProduct: vi.fn(),
    };
});

describe('listProducts endpoint', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should call apiClient with the correct URL', async () => {
        const apiClientSpy = vi.spyOn(client, 'default');
        (apiClientSpy as Mock).mockResolvedValue({
            json: () => Promise.resolve({ success: true, data: [] }),
        } as any);
        vi.spyOn(schemas, 'parseAndTransformProducts').mockReturnValue([] as any);

        await listProducts();

        expect(apiClientSpy).toHaveBeenCalledWith('/api/v1/inventory');
        expect(apiClientSpy).toHaveBeenCalledTimes(1);
    });

    it('should call parseAndTransformProducts with the payload from apiClient', async () => {
        const mockPayload = { success: true, data: [{ id: '123' }] };
        vi.spyOn(client, 'default').mockResolvedValue({
            json: () => Promise.resolve(mockPayload),
        } as any);
        const parseSpy = vi.spyOn(schemas, 'parseAndTransformProducts');

        await listProducts();

        expect(parseSpy).toHaveBeenCalledWith(mockPayload);
        expect(parseSpy).toHaveBeenCalledTimes(1);
    });

    it('should return the result from parseAndTransformProducts', async () => {
        const mockTransformedData = [{ id: 'transformed-123', serialNumber: 'SN1' }];
        vi.spyOn(client, 'default').mockResolvedValue({
            json: () => Promise.resolve({}),
        } as any);
        vi.spyOn(schemas, 'parseAndTransformProducts').mockReturnValue(mockTransformedData as any);

        const result = await listProducts();

        expect(result).toEqual(mockTransformedData);
    });

    it('should re-throw an error if apiClient fails', async () => {
        const mockError = new Error('Network Error');
        vi.spyOn(client, 'default').mockRejectedValue(mockError);
        const parseSpy = vi.spyOn(schemas, 'parseAndTransformProducts');

        await expect(listProducts()).rejects.toThrow(mockError);
        expect(parseSpy).not.toHaveBeenCalled();
    });

    it('should re-throw an error if parsing fails', async () => {
        const mockError = new Error('Parsing Error');
        vi.spyOn(client, 'default').mockResolvedValue({
            json: () => Promise.resolve({}),
        } as any);
        vi.spyOn(schemas, 'parseAndTransformProducts').mockImplementation(() => {
            throw mockError;
        });

        await expect(listProducts()).rejects.toThrow(mockError);
    });

    it('builds query string from ListParams and calls correct URL', async () => {
        const apiClientSpy = vi.spyOn(client, 'default');
        (apiClientSpy as Mock).mockResolvedValue({
            json: () => Promise.resolve({ success: true, data: [] }),
        } as any);
        vi.spyOn(schemas, 'parseAndTransformProducts').mockReturnValue([] as any);

        const params: ListParams = {
            q: 'laptop',
            page: 2,
            pageSize: 25,
            sortBy: 'name',
            sortOrder: 'asc',
            brandId: 'b1',
            categoryId: 'c1',
            locationId: 'l1',
            condition: 'available',
            hasSerialNumber: true,
            minCost: 100,
            maxCost: 999,
            purchaseDateFrom: new Date('2023-01-01').toISOString(),
            purchaseDateTo: new Date('2023-12-31').toISOString(),
        };

        await listProducts(params);

        const urlCalled = (apiClientSpy as Mock).mock.calls[0][0] as string;
        expect(urlCalled.startsWith('/api/v1/inventory?')).toBe(true);
        expect(urlCalled).toContain('q=laptop');
        expect(urlCalled).toContain('page=2');
        expect(urlCalled).toContain('pageSize=25');
        expect(urlCalled).toContain('sortBy=name');
        expect(urlCalled).toContain('sortOrder=asc');
        expect(urlCalled).toContain('brandId=b1');
        expect(urlCalled).toContain('categoryId=c1');
        expect(urlCalled).toContain('locationId=l1');
        expect(urlCalled).toContain('condition=available');
        expect(urlCalled).toContain('hasSerialNumber=true');
        expect(urlCalled).toContain('minCost=100');
        expect(urlCalled).toContain('maxCost=999');
        expect(urlCalled).toContain('purchaseDateFrom=');
        expect(urlCalled).toContain('purchaseDateTo=');
    });

    it('URL-encodes special characters in q parameter', async () => {
        const apiClientSpy = vi.spyOn(client, 'default');
        (apiClientSpy as Mock).mockResolvedValue({
            json: () => Promise.resolve({ success: true, data: [] }),
        } as any);
        vi.spyOn(schemas, 'parseAndTransformProducts').mockReturnValue([] as any);

        const qRaw = 'laptop con ñ & acentos';
        const params = { q: qRaw } as any;
        await listProducts(params);

        const urlCalled = (apiClientSpy as Mock).mock.calls[0][0] as string;
        const expectedQs = new URLSearchParams({ q: qRaw }).toString();

        expect(urlCalled.startsWith('/api/v1/inventory?')).toBe(true);
        expect(urlCalled).toContain(expectedQs);
        // ensure raw string not present
        expect(urlCalled.includes(qRaw)).toBe(false);
    });
});

describe('getProduct endpoint', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should call apiClient with the correct URL and parse response', async () => {
        const mockPayload = { success: true, data: { id: '1' } };
        const apiClientSpy = vi.spyOn(client, 'default');
        (apiClientSpy as Mock).mockResolvedValue({
            json: () => Promise.resolve(mockPayload),
        } as any);
        const parseSpy = vi.spyOn(schemas, 'parseAndTransformProduct');
        const parsed = { id: '1', name: 'A' } as any;
        parseSpy.mockReturnValue(parsed);

        const result = await getProduct('1');

        expect(apiClientSpy).toHaveBeenCalledWith('/api/v1/inventory/1');
        expect(parseSpy).toHaveBeenCalledWith(mockPayload);
        expect(result).toBe(parsed);
    });

    it('should URL-encode the product id in the request path', async () => {
        const trickyId = 'abc 123/xyz';
        const encoded = encodeURIComponent(trickyId);
        const apiClientSpy = vi.spyOn(client, 'default');
        (apiClientSpy as Mock).mockResolvedValue({
            json: () => Promise.resolve({ success: true, data: { id: trickyId } }),
        } as any);
        vi.spyOn(schemas, 'parseAndTransformProduct').mockReturnValue({ id: trickyId } as any);

        await getProduct(trickyId);

        expect(apiClientSpy).toHaveBeenCalledWith(`/api/v1/inventory/${encoded}`);
    });

    it('should re-throw an error if apiClient fails', async () => {
        const mockError = new Error('Network Error');
        vi.spyOn(client, 'default').mockRejectedValue(mockError);
        const parseSpy = vi.spyOn(schemas, 'parseAndTransformProduct');

        await expect(getProduct('x')).rejects.toThrow(mockError);
        expect(parseSpy).not.toHaveBeenCalled();
    });

    it('should re-throw an error if parsing fails', async () => {
        const mockError = new Error('Parsing Error');
        vi.spyOn(client, 'default').mockResolvedValue({
            json: () => Promise.resolve({}),
        } as any);
        vi.spyOn(schemas, 'parseAndTransformProduct').mockImplementation(() => {
            throw mockError;
        });

        await expect(getProduct('y')).rejects.toThrow(mockError);
    });
});

describe('createProduct endpoint', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should POST to the correct URL with body and parse response', async () => {
        const data = { name: 'Created' } as any;
        const payload = { success: true, data: { id: 'c1' } };
        const apiClientSpy = vi.spyOn(client, 'default');
        (apiClientSpy as Mock).mockResolvedValue({
            json: () => Promise.resolve(payload),
        } as any);
        const parseSpy = vi.spyOn(schemas, 'parseAndTransformProduct');
        const parsed = { id: 'c1' } as any;
        parseSpy.mockReturnValue(parsed);

        const result = await createProduct(data);

        expect(apiClientSpy).toHaveBeenCalledWith('/api/v1/inventory', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        expect(parseSpy).toHaveBeenCalledWith(payload);
        expect(result).toBe(parsed);
    });

    it('should re-throw an error if apiClient fails', async () => {
        const mockError = new Error('Network Error');
        vi.spyOn(client, 'default').mockRejectedValue(mockError);

        await expect(createProduct({} as any)).rejects.toThrow(mockError);
    });

    it('should re-throw an error if parsing fails', async () => {
        vi.spyOn(client, 'default').mockResolvedValue({
            json: () => Promise.resolve({}),
        } as any);
        const mockError = new Error('Parsing Error');
        vi.spyOn(schemas, 'parseAndTransformProduct').mockImplementation(() => {
            throw mockError;
        });

        await expect(createProduct({} as any)).rejects.toThrow(mockError);
    });
});

describe('updateProduct endpoint', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should PUT to the correct URL with body and parse response', async () => {
        const id = 'u1';
        const data = { name: 'Updated' } as any;
        const payload = { success: true, data: { id } };
        const apiClientSpy = vi.spyOn(client, 'default');
        (apiClientSpy as Mock).mockResolvedValue({
            json: () => Promise.resolve(payload),
        } as any);
        const parseSpy = vi.spyOn(schemas, 'parseAndTransformProduct');
        const parsed = { id } as any;
        parseSpy.mockReturnValue(parsed);

        const result = await updateProduct(id, data);

        expect(apiClientSpy).toHaveBeenCalledWith(`/api/v1/inventory/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        expect(parseSpy).toHaveBeenCalledWith(payload);
        expect(result).toBe(parsed);
    });

    it('should URL-encode the id when updating a product', async () => {
        const trickyId = 'id with spaces/and/slashes';
        const encoded = encodeURIComponent(trickyId);
        const data = { name: 'Updated' } as any;
        const apiClientSpy = vi.spyOn(client, 'default');
        (apiClientSpy as Mock).mockResolvedValue({
            json: () => Promise.resolve({ success: true, data: { id: trickyId } }),
        } as any);
        vi.spyOn(schemas, 'parseAndTransformProduct').mockReturnValue({ id: trickyId } as any);

        await updateProduct(trickyId, data);

        expect(apiClientSpy).toHaveBeenCalledWith(`/api/v1/inventory/${encoded}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    });

    it('should re-throw an error if apiClient fails', async () => {
        const mockError = new Error('Network Error');
        vi.spyOn(client, 'default').mockRejectedValue(mockError);

        await expect(updateProduct('u2', {} as any)).rejects.toThrow(mockError);
    });

    it('should re-throw an error if parsing fails', async () => {
        vi.spyOn(client, 'default').mockResolvedValue({
            json: () => Promise.resolve({}),
        } as any);
        const mockError = new Error('Parsing Error');
        vi.spyOn(schemas, 'parseAndTransformProduct').mockImplementation(() => {
            throw mockError;
        });

        await expect(updateProduct('u3', {} as any)).rejects.toThrow(mockError);
    });
});

describe('deleteProduct endpoint', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should DELETE to the correct URL and resolve without parsing', async () => {
        const id = 'd1';
        const apiClientSpy = vi.spyOn(client, 'default');
        (apiClientSpy as Mock).mockResolvedValue({} as any);
        const parseProductsSpy = vi.spyOn(schemas, 'parseAndTransformProducts');
        const parseProductSpy = vi.spyOn(schemas, 'parseAndTransformProduct');

        await deleteProduct(id);

        expect(apiClientSpy).toHaveBeenCalledWith(`/api/v1/inventory/${id}`, {
            method: 'DELETE',
        });
        expect(parseProductsSpy).not.toHaveBeenCalled();
        expect(parseProductSpy).not.toHaveBeenCalled();
    });

    it('should URL-encode the id when deleting a product', async () => {
        const trickyId = 'foo/bar baz';
        const encoded = encodeURIComponent(trickyId);
        const apiClientSpy = vi.spyOn(client, 'default');
        (apiClientSpy as Mock).mockResolvedValue({} as any);

        await deleteProduct(trickyId);

        expect(apiClientSpy).toHaveBeenCalledWith(`/api/v1/inventory/${encoded}`, {
            method: 'DELETE',
        });
    });

    it('should re-throw an error if apiClient fails', async () => {
        const mockError = new Error('Network Error');
        vi.spyOn(client, 'default').mockRejectedValue(mockError);

        await expect(deleteProduct('d2')).rejects.toThrow(mockError);
    });
});
