/**
 * API Contracts for GATI-C - Thresholds Module
 * 
 * This file defines the TypeScript interfaces for API communication
 * between frontend and backend, specifically for the thresholds module.
 * 
 * Aligned with:
 * - @SRS Section 7.4 (Response Structure)
 * - @PRD Section 2.1 (Role-based permissions)
 * - Existing InventoryLowStockThresholds interface in app-context.tsx
 * 
 * @version 1.0
 * @created 2025-07-25
 */

// ============================================================================
// BASE API RESPONSE STRUCTURE (SRS 7.4)
// ============================================================================

/**
 * Standard API response structure for all endpoints
 * Follows SRS 7.4 specification
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
}

// ============================================================================
// THRESHOLDS MODULE CONTRACTS
// ============================================================================

/**
 * Thresholds data structure
 * Matches existing InventoryLowStockThresholds interface from app-context.tsx
 */
export interface ThresholdsData {
    globalThreshold: number;
    categoryThresholds: Record<string, number>;
    productThresholds: Record<number, number>;
}

/**
 * Request payload for updating global threshold
 * Admin only - requires authentication and role validation
 */
export interface UpdateGlobalThresholdRequest {
    value: number;
}

/**
 * Request payload for updating category threshold
 * Admin only - requires authentication and role validation
 */
export interface UpdateCategoryThresholdRequest {
    value: number;
}

/**
 * Request payload for updating product threshold
 * Admin only - requires authentication and role validation
 */
export interface UpdateProductThresholdRequest {
    value: number;
}

/**
 * Response for GET /api/v1/thresholds
 * Returns all thresholds (global, category, product)
 */
export type GetThresholdsResponse = ApiResponse<ThresholdsData>;

/**
 * Response for POST /api/v1/thresholds/global
 * Returns updated global threshold with metadata
 */
export interface UpdateGlobalThresholdResponse {
    globalThreshold: number;
    updatedBy: string;
    updatedAt: string;
}

/**
 * Response for POST /api/v1/thresholds/category/:categoryName
 * Returns updated category threshold with metadata
 */
export interface UpdateCategoryThresholdResponse {
    categoryName: string;
    threshold: number;
    updatedBy: string;
    updatedAt: string;
}

/**
 * Response for POST /api/v1/thresholds/product/:productId
 * Returns updated product threshold with metadata
 */
export interface UpdateProductThresholdResponse {
    productId: number;
    threshold: number;
    updatedBy: string;
    updatedAt: string;
}

// ============================================================================
// ERROR CODES (SRS 7.4)
// ============================================================================

/**
 * Standard error codes for thresholds module
 * Follows SRS 7.4 error response structure
 */
export const THRESHOLD_ERROR_CODES = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ThresholdErrorCode = typeof THRESHOLD_ERROR_CODES[keyof typeof THRESHOLD_ERROR_CODES];

// ============================================================================
// VALIDATION CONSTRAINTS
// ============================================================================

/**
 * Validation constraints for threshold values
 * Based on business logic requirements
 */
export const THRESHOLD_CONSTRAINTS = {
    MIN_VALUE: 0,
    MAX_VALUE: 9999,
    MIN_GLOBAL_THRESHOLD: 1,
} as const;

/**
 * Validates threshold value according to business rules
 */
export function validateThresholdValue(value: number): boolean {
    return value >= THRESHOLD_CONSTRAINTS.MIN_VALUE &&
        value <= THRESHOLD_CONSTRAINTS.MAX_VALUE;
}

/**
 * Validates global threshold value (must be at least 1)
 */
export function validateGlobalThresholdValue(value: number): boolean {
    return value >= THRESHOLD_CONSTRAINTS.MIN_GLOBAL_THRESHOLD &&
        value <= THRESHOLD_CONSTRAINTS.MAX_VALUE;
} 