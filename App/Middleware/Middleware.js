const jwt = require("jsonwebtoken");

const Middleware = (req, res, next) => {
    try {

        // ==========================================
        // GET TOKEN
        // ==========================================

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                status: 0,
                message: "Access denied. Token missing.",
            });
        }

        const token = authHeader.split(" ")[1];

        // ==========================================
        // VERIFY TOKEN
        // ==========================================

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // ==========================================
        // SAVE USER
        // ==========================================

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            status: 0,
            message: "Invalid or expired token",
        });

    }
};

module.exports = Middleware;