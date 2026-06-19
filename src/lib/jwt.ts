import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

export type JwtPayload = {
  userId: string;
  role: "customer" | "admin";
};

export type TokenType = "access" | "refresh";

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign({ ...payload, type: "access" }, JWT_SECRET as string, {
    expiresIn: ACCESS_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign({ ...payload, type: "refresh" }, JWT_SECRET as string, {
    expiresIn: REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyToken(token: string, expectedType: TokenType): JwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload & { type: TokenType };
  if (decoded.type !== expectedType) {
    throw new Error(`Invalid token type: expected ${expectedType}, got ${decoded.type}`);
  }
  return { userId: decoded.userId, role: decoded.role };
}
