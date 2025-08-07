import { z } from "zod";
import { TrashType, Status } from "@/generated/prisma/client";

export const generateTransactionSchema = z.array(
  z.object({
    trashType: z.enum(TrashType, "Jenis sampah tidak valid"),
    weight: z
      .number("Berat harus berupa angka")
      .positive("Berat harus lebih dari 0"),
  }),
);

export const verifyTransactionSchema = z.object({
  payload: z.object({
    userId: z.string().min(1, "User ID wajib diisi"),
    trash: z
      .array(
        z.object({
          trashType: z.enum(TrashType, "Jenis sampah tidak valid"),
          weight: z
            .number("Berat harus berupa angka")
            .positive("Berat harus lebih dari 0"),
        }),
      )
      .min(1, "Minimal satu data sampah diperlukan"),
    timestamp: z
      .number("Timestamp tidak valid")
      .int("Timestamp harus bilangan bulat")
      .positive("Timestamp harus positif"),
    expiresAt: z
      .number("Expired timestamp tidak valid")
      .int("ExpiredAt harus bilangan bulat")
      .positive("ExpiredAt harus positif"),
  }),
  signature: z.string().min(10, "Signature minimal 10 karakter"),
  status: z.enum(Status, "Status transaksi tidak valid"),
});
