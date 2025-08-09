import { z } from "zod";
import { TrashType, Status } from "@/generated/prisma";

export const prepareDepositTrashSchema = z.object({
  trash: z.array(
    z.object({
      trashType: z.enum(TrashType, "Jenis sampah tidak valid"),
      weight: z
        .number("Berat harus berupa angka")
        .positive("Berat harus lebih dari 0"),
    }),
  ),
});

export const verifyDepositTrashSchema = z.object({
  payloadId: z
    .string()
    .min(10, "Payload id harus berisikan 10 karakter")
    .max(10, "Payload id harus berisikan 10 karakter"),
  signature: z.string().min(10, "Signature minimal 10 karakter"),
});

export const submitDepositTrashSchema = z.object({
  payloadId: z.string().min(10, "id minimal 10 karakter"),
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
  signature: z.string().min(10, "Signature minimal 10 karakter"),
  status: z.enum(Status, "Status transaksi tidak valid"),
});
