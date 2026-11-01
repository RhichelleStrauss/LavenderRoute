
const requireRole = (...allowed) => (req, res, next) => {
    const roles = req.user?.roles || [];
    if (!allowed.some(role => roles.includes(role))) {
        return res.status(403).json({ message: 'You do not have permission to do that.' });
    }
    next();
};

module.exports = requireRole;
