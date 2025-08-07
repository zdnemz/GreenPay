import { Role, Status, TrashType } from "@/generated/prisma";

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T | null;
  pagination?: Pagination;
  error?: unknown;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface UserData {
  name: string;
  id: string;
  email: string;
  points: number;
  currentRank: number | null;
  lastRank: number | null;
  role: Role;
  createdAt: Date;
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
  role: Role.USER;
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

export interface AdminAnalyticData {
  totalUser: number;
  totalPetugas: number;
  totalTransaksi: number;
  totalSampah: {
    type: TrashType;
    total: number;
  }[];
  transaksiPerBulan: {
    bulan: number;
    tahun: number;
    jumlah: number;
  }[];
  transaksiStatus: {
    pending: number;
    approved: number;
    rejected: number;
  };
}

export interface AdminUserData {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
