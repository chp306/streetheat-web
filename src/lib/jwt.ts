import jwt from "jsonwebtoken";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return secret;
}

export function signAccessToken(payload: object): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "15m" });
}

export function signRefreshToken(payload: object): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): jwt.JwtPayload {
  return jwt.verify(token, getSecret()) as jwt.JwtPayload;
}
