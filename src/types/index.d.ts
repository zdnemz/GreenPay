import { BalanceRefType, Role, Status, TrashType } from "@/generated/prisma";
import { Decimal } from "@/generated/prisma/runtime/library";

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
  balance: string;
  currentRank: number | null;
  lastRank: number | null;
  role: Role;
  createdAt: Date;
}

// ======================== interface leaderboard routes ========================
export interface LeaderboardData {
  users: {
    name: string;
    id: string;
    points: number;
    currentRank: number | null;
  }[];
  me:
    | {
        name: string;
        id: string;
        points: number;
        currentRank: number | null;
      }
    | undefined;
}

export interface AdminAnalyticData {
  totalUser: number;
  totalPetugas: number;
  totalTransaksi: number;
  totalSampah: {
    type: $Enums.TrashType;
    total: number;
  }[];
  transaksiPerBulan: {
    bulan: number;
    tahun: number;
    jumlah: number;
  }[];
  transaksiStatus: {
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

// ======================== interface Trash routes ========================
export interface TrashPrepareData {
  payloadId: string;
  signature: string;
  expiresAt: number;
}

export interface TrashItem {
  trashType: TrashType;
  weight: number;
  points: number;
}

interface TrashHistory {
  status: Status;
  signature: string;
  id: string;
  createdAt: Date;
  user: {
    name: string;
    id: string;
  };
  petugas: {
    name: string;
    id: string;
  } | null;
  items: TrashItem[];
}

export type TrashHistoryData = TrashHistory[];

export interface TrashSubmitData {
  id: string;
  status: Status;
  createdAt: Date;
  signature: string;
  petugas: {
    name: string;
    id: string;
  } | null;
  items: {
    trashType: TrashType;
    weight: number;
    id: string;
    points: number;
    trashDepositId: string;
  }[];
  totalPoints: number;
  totalWeight: number;
}

export interface TrashPayload {
  user: {
    id: string;
    name: string;
  };
  trash: {
    trashType: TrashType;
    weight: number;
  }[];
  timestamp: number;
  expiresAt: number;
}

export interface TrashVerifyData {
  payload: {
    user: {
      id: string;
      name: string;
    };
    trash: {
      trashType: TrashType;
      weight: number;
    }[];
    timestamp: number;
    expiresAt: number;
    payloadId: string;
  };
  signature: string;
}

// balance
interface BalanceHistory {
  id: string;
  createdAt: Date;
  amount: Decimal;
  reason: string;
  refType: BalanceRefType;
  refId: string | null;
}

export type BalanceHistoryData = BalanceHistory[];
