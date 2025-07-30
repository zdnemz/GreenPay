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
  points: number;
  rank: number;
}

export interface leaderboardData {
  users: {
    rank: number;
    id: string;
    name: string;
    role: string;
    points: number;
  }[];
  myRank: number;
  myPoints: number;
  role: "USER";
  page: number;
}
