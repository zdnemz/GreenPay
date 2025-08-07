import crypto from "crypto";

const SECRET = process.env.SIGNATURE_SECRET;

export function generateSignature(payload: object) {
  if (!SECRET) throw new Error("QR SECRET was not setted");
  const data = JSON.stringify(payload);
  return crypto.createHmac("sha256", SECRET).update(data).digest("hex");
}

export function verifySignature(payload: object, signature: string) {
  const expected = generateSignature(payload);
  return expected === signature;
}
