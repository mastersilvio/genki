import { loadEnvironment } from "@genki/config";
import { db, schema } from "@genki/database";
import { eq } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";

const environment = loadEnvironment();
const secret = new TextEncoder().encode(environment.APP_SECRET_KEY);

export interface Session {
  userId: string;
  email: string;
}

export const authenticate = async (
  email: string,
  password: string,
): Promise<string | null> => {
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email.toLowerCase()))
    .limit(1);

  if (!user?.isActive) return null;
  if (!(await Bun.password.verify(password, user.passwordHash))) return null;

  return new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret);
};

export const readSession = async (
  authorization?: string,
): Promise<Session | null> => {
  if (!authorization?.startsWith("Bearer ")) return null;
  try {
    const { payload } = await jwtVerify(authorization.slice(7), secret);
    if (!payload.sub || typeof payload.email !== "string") return null;
    return { userId: payload.sub, email: payload.email };
  } catch {
    return null;
  }
};
