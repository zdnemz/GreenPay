export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T | null;
  pagination?: Pagination;
  error?: unknown;
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "PETUGAS" | "ADMIN";
}

export interface UserData {
  name: string;
  id: string;
  email: string;
  points: number;
  currentRank: number | null;
  lastRank: number | null;
  role: User["role"];
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
