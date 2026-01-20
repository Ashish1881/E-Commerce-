import jwt from "jsonwebtoken";

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Token is not found" });
    }

    const decoded = await jwt.verify(token, process.env.PRIVATEKEY);
    const { role } = decoded;
    if (role === "ADMIN") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins are allowed to add products.",
      });
    }

    next();
  } catch (error) {
    res.status(500).send("ERROR : " + error.message);
  }
};

export default adminAuthMiddleware;
