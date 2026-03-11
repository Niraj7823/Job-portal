// import jwt from "jsonwebtoken";

// export const verifyToken = (token: string) => {
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     return decoded;
//   } catch (error) {
//     return null;
//   }
// };
// export interface TokenPayload {
//   id: string;
//   role: string;
// }
import jwt from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  role: string;
}

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    return decoded;
  } catch (error) {
    return null;
  }
};
