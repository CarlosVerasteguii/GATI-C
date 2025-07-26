/**
 * API Endpoints Constants for GATI-C
 * 
 * Centralized definition of all API endpoints following SRS 7.1 versioning
 * and SRS 7.3 naming conventions.
 * 
 * @version 1.0
 * @created 2025-07-25
 */

// ============================================================================
// API VERSION (SRS 7.1)
// ============================================================================

export const API_VERSION = 'v1';
export const API_BASE_PATH = `/api/${API_VERSION}`;

// ============================================================================
// THRESHOLDS ENDPOINTS
// ============================================================================

/**
 * Thresholds module endpoints
 * Admin only - requires authentication and role validation
 */
export const THRESHOLDS_ENDPOINTS = {
    // GET all thresholds (global, category, product)
    GET_ALL: `${API_BASE_PATH}/thresholds`,

    // POST update global threshold
    UPDATE_GLOBAL: `${API_BASE_PATH}/thresholds/global`,

    // POST update category threshold
    UPDATE_CATEGORY: (categoryName: string) =>
        `${API_BASE_PATH}/thresholds/category/${encodeURIComponent(categoryName)}`,

    // POST update product threshold
    UPDATE_PRODUCT: (productId: number) =>
        `${API_BASE_PATH}/thresholds/product/${productId}`,
} as const;

// ============================================================================
// HTTP METHODS
// ============================================================================

export const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
} as const;

// ============================================================================
// ENDPOINT METADATA
// ============================================================================

/**
 * Metadata for thresholds endpoints
 * Used for documentation and validation
 */
export const THRESHOLDS_ENDPOINT_METADATA = {
    [THRESHOLDS_ENDPOINTS.GET_ALL]: {
        method: HTTP_METHODS.GET,
        description: 'Get all thresholds (global, category, product)',
        requiresAuth: true,
        requiresRole: ['Administrador', 'Editor'],
        responseType: 'GetThresholdsResponse',
    },
    [THRESHOLDS_ENDPOINTS.UPDATE_GLOBAL]: {
        method: HTTP_METHODS.POST,
        description: 'Update global threshold (Admin only)',
        requiresAuth: true,
        requiresRole: ['Administrador'],
        requestType: 'UpdateGlobalThresholdRequest',
        responseType: 'UpdateGlobalThresholdResponse',
    },
    'UPDATE_CATEGORY_TEMPLATE': {
        method: HTTP_METHODS.POST,
        description: 'Update category threshold (Admin only)',
        requiresAuth: true,
        requiresRole: ['Administrador'],
        requestType: 'UpdateCategoryThresholdRequest',
        responseType: 'UpdateCategoryThresholdResponse',
    },
    'UPDATE_PRODUCT_TEMPLATE': {
        method: HTTP_METHODS.POST,
        description: 'Update product threshold (Admin only)',
        requiresAuth: true,
        requiresRole: ['Administrador'],
        requestType: 'UpdateProductThresholdRequest',
        responseType: 'UpdateProductThresholdResponse',
    },
} as const; 