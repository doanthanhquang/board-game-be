/**
 * Base Model Class
 * Provides common functionality for all models
 * Note: This is a simple in-memory implementation. Database integration will be added later.
 */

export class BaseModel {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Generate a simple unique ID
   * In production, this would be replaced with database-generated IDs
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update the updatedAt timestamp
   */
  touch() {
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Convert model instance to plain object
   */
  toJSON() {
    return { ...this };
  }

  /**
   * Validate model data
   * Override in child classes for specific validation
   */
  validate() {
    return { valid: true, errors: [] };
  }
}
