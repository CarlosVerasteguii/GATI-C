import { describe, it, expect } from 'vitest';
import { parseAndTransformProducts } from '../../../../../lib/api/schemas/inventory';
import { ZodError } from 'zod';

const createMockProduct = (overrides = {}) => ({
    // Required fields from ProductWireSchema (strict)
    id: 'clx123abc',
    name: 'Test Product',
    serialNumber: 'SN12345', // nullable in schema but included here
    description: null,
    cost: 100.5,
    purchaseDate: new Date().toISOString(), // string ISO (nullable allowed)
    condition: null,
    brandId: null,
    categoryId: null,
    locationId: null,
    createdAt: new Date().toISOString(), // string ISO required
    updatedAt: new Date().toISOString(), // string ISO required
    documents: [],
    brand: null,
    category: null,
    location: null,
    // No extra fields beyond schema because it's strict()
    ...overrides,
});

const createMockPayload = (data: any[]) => ({
    success: true,
    data,
});

describe('parseAndTransformProducts', () => {
    it('should parse a valid payload and transform dates correctly', () => {
        const purchaseDate = new Date('2023-01-01T12:00:00.000Z');
        const createdAt = new Date('2023-01-02T12:00:00.000Z');
        const mockProduct = createMockProduct({
            purchaseDate: purchaseDate.toISOString(),
            createdAt: createdAt.toISOString(),
        });

        const payload = createMockPayload([mockProduct]);
        const result = parseAndTransformProducts(payload);

        expect(result).toHaveLength(1);
        expect(result[0].purchaseDate).toEqual(purchaseDate);
        expect(result[0].createdAt).toEqual(createdAt);
        expect(result[0].serialNumber).toBe('SN12345');
    });

    it('should throw a ZodError if the payload envelope is invalid', () => {
        const invalidPayload = { success: true, items: [] }; // 'items' instead of 'data'
        expect(() => parseAndTransformProducts(invalidPayload)).toThrow(ZodError);
    });

    it('should throw a ZodError if a product is missing a required field', () => {
        const productWithMissingField = createMockProduct();
        delete (productWithMissingField as any).name; // name is required by schema
        const payload = createMockPayload([productWithMissingField]);

        expect(() => parseAndTransformProducts(payload)).toThrow(ZodError);
    });

    it('should throw a ZodError if a field has an incorrect type', () => {
        const productWithWrongType = createMockProduct({ cost: '123' as any }); // cost must be number|null
        const payload = createMockPayload([productWithWrongType]);

        expect(() => parseAndTransformProducts(payload)).toThrow(ZodError);
    });

    it('should throw a ZodError for an invalid date string', () => {
        const productWithInvalidDate = createMockProduct({ createdAt: 'not-a-date' });
        const payload = createMockPayload([productWithInvalidDate]);

        expect(() => parseAndTransformProducts(payload)).toThrow(ZodError);
    });

    it('should throw a ZodError when extra fields are present due to strict schema', () => {
        const productWithExtraField = createMockProduct({ extraField: 'not-allowed' });
        const payload = createMockPayload([productWithExtraField]);

        expect(() => parseAndTransformProducts(payload)).toThrow(ZodError);
    });

    it('should handle null for optional fields like purchaseDate', () => {
        const productWithNullDate = createMockProduct({ purchaseDate: null });
        const payload = createMockPayload([productWithNullDate]);
        const result = parseAndTransformProducts(payload);

        expect(result[0].purchaseDate).toBeNull();
    });
});
