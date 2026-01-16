/**
 * Role-based authorization middleware
 * Checks if the authenticated user has the required role
 */

/**
 * Middleware to require a specific role
 * @param {string|string[]} requiredRoles - Single role or array of roles that are allowed
 * @returns {Function} Express middleware function
 */
export const requireRole = (requiredRoles) => {
  const allowedRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  return (req, res, next) => {
    // Ensure user is authenticated (should be checked by authenticate middleware first)
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions. This action requires a different role.',
      });
    }

    next();
  };
};
