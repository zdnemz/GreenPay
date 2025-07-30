import type { Decimal } from "@prisma/client/runtime/library";

export interface User {
  id: string;
  email: string;
  role: "USER" | "PETUGAS" | "ADMIN";
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  balance: Decimal;
  role: User["role"];
  createdAt: Date;
}
