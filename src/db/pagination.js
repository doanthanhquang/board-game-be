/**
 * Pagination Utilities
 * Shared utilities for handling pagination across all models
 */

/**
 * Validate and normalize pagination parameters
 * @param {number|string} page - Page number (1-based)
 * @param {number|string} pageSize - Items per page
 * @param {number} defaultPageSize - Default page size if not provided
 * @param {number} maxPageSize - Maximum allowed page size
 * @returns {Object} Normalized pagination parameters { page, pageSize, offset }
 */
export const normalizePagination = (page, pageSize, defaultPageSize = 20, maxPageSize = 100) => {
  const safePage = Number.isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);
  const safePageSize = Number.isNaN(Number(pageSize)) || Number(pageSize) < 1 
    ? defaultPageSize 
    : Math.min(Number(pageSize), maxPageSize);
  
  const offset = (safePage - 1) * safePageSize;

  return {
    page: safePage,
    pageSize: safePageSize,
    offset,
  };
};

/**
 * Format pagination response
 * @param {Array} items - Array of items for current page
 * @param {number} page - Current page number
 * @param {number} pageSize - Items per page
 * @param {number} total - Total number of items
 * @returns {Object} Pagination response object
 */
export const formatPaginationResponse = (items, page, pageSize, total) => {
  return {
    items,
    page,
    pageSize,
    total: Number(total),
  };
};
