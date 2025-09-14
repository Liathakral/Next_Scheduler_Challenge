// src/lib/jwt.ts
import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error("JWT_SECRET env var required");
}

export type SessionPayload = {
  userId: string;
  role: "seller" | "buyer";
};

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifySession(token: string) {
  try {
    return jwt.verify(token, SECRET) as SessionPayload;
  } catch {
    return null;
  }
}
