import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listProducts } from '../../../../../lib/api/endpoints/inventory';
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
