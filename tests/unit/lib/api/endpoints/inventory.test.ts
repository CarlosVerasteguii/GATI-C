import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../../../../../lib/api/endpoints/inventory';
import * as client from '../../../../../lib/api/client';
import * as schemas from '../../../../../lib/api/schemas/inventory';
import type { Mock } from 'vitest';

// Mock dependencies
vi.mock('../../../../../lib/api/client');
vi.mock('../../../../../lib/api/schemas/inventory');

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

    it('should re-throw an error if apiClient fails', async () => {
        const mockError = new Error('Network Error');
        vi.spyOn(client, 'default').mockRejectedValue(mockError);

        await expect(deleteProduct('d2')).rejects.toThrow(mockError);
    });
});
