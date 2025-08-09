import { encode, decode } from "@msgpack/msgpack";

// Base64URL Encode untuk Uint8Array -> string
export function toBase64Url(uint8: Uint8Array): string {
  const chunkSize = 0x8000; // chunk 32KB
  let result = "";
  for (let i = 0; i < uint8.length; i += chunkSize) {
    const chunk = uint8.subarray(i, i + chunkSize);
    result += String.fromCharCode(...chunk);
  }
  const base64 = btoa(result);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Base64URL Decode dari string -> Uint8Array
export function fromBase64Url(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const binStr = atob(base64);
  const arr = new Uint8Array(binStr.length);
  for (let i = 0; i < binStr.length; i++) arr[i] = binStr.charCodeAt(i);
  return arr;
}

// Encode data bertipe generic -> string
export function encoder<T>(data: T): string {
  const packed: Uint8Array = encode(data);
  return toBase64Url(packed);
}

// Decode string -> data bertipe generic
export function decoder<T>(encoded: string): T {
  const compressed: Uint8Array = fromBase64Url(encoded);
  return decode(compressed) as T;
}
