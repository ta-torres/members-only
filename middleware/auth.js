const authMiddleware = {
  requireAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/auth/login");
  },

  requireMember: (req, res, next) => {
    if (
      req.isAuthenticated() &&
      (req.user.roles.includes("member") || req.user.roles.includes("admin"))
    ) {
      return next();
    }
    res.status(403).send("Access denied. Members only.");
  },

  requireAdmin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.roles.includes("admin")) {
      return next();
    }
    res.status(403).send("Access denied. Admins only.");
  },
};

module.exports = authMiddleware;
