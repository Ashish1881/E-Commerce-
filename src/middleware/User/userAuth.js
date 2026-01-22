import jwt from "jsonwebtoken";

const userAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Token is not found Please Login..." });
    }

    const decoded = await jwt.verify(token, process.env.PRIVATEKEY);

    if (decoded.role !== "USER") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only user are allowed...",
      });
    } else {
      req.user = decoded;
      next();
    }
  } catch (error) {
    return res.status(500).send("ERROR : " + error.message);
  }
};

export default userAuthMiddleware;
