import crypto from "crypto";

const SECRET = process.env.SIGNATURE_SECRET;

export function generateSignature(value: string) {
  if (!SECRET) throw new Error("QR SECRET was not setted");
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export function verifySignature(value: string, signature: string) {
  const expected = generateSignature(value);
  return expected === signature;
}
