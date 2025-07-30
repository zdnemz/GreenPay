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

export interface LeaderboardData {
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

export interface TransactionData {
  data: {
    id: string;
    createdAt: Date;
    userId: string;
    petugasId: string | null;
    trashType: TrashType;
    points: number;
    status: Status;
  }[];
  page: number;
  total: number;
  totalPages: number;
}
