import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token não fornecido",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json({
        message: "Formato de token inválido",
      });
    }

    const [scheme, token] = parts;

    if (scheme !== "Bearer") {
      return res.status(401).json({
        message: "Esquema de token inválido",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = Number(decoded.sub);

    next();
  } catch {
    return res.status(401).json({
      message: "token inválido ou expirado",
    });
  }
}
