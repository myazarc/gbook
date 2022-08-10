import jwt from "jsonwebtoken";
export function jwtSign(userId: number, userEmail: string) {
  return jwt.sign({ userId, userEmail }, process.env.JWT_SECRET as any, { expiresIn: "1h" });
}

export function jwtVerify(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET as any);
}
