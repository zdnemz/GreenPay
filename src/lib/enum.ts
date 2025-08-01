export const Role = {
  USER: "USER",
  PETUGAS: "PETUGAS",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const TrashType = {
  PLASTIC: "PLASTIC",
  PAPER: "PAPER",
  METAL: "METAL",
  ORGANIC: "ORGANIC",
  OTHER: "OTHER",
} as const;

export type TrashType = (typeof TrashType)[keyof typeof TrashType];

export const Status = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type Status = (typeof Status)[keyof typeof Status];
