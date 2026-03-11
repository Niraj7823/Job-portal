import { verifyToken } from "./auth";

export const requireAdmin = (token?: string) => {
  if (!token) throw new Error("Unauthorized");

  const decoded: any = verifyToken(token);
  if (decoded.role !== "admin") {
    throw new Error("Forbidden");
  }

  return decoded;
};
