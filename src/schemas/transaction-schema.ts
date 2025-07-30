import { z } from "zod";
import { TrashType } from "@/generated/prisma/client";
import { POINTS_CONFIG } from "@/lib/points";

export const createTransactionSchema = z.object({
  userId: z.uuid(),

  trashType: z.nativeEnum(TrashType),

  weight: z
    .string()
    .refine(
      (val) => {
        const num = parseFloat(val);
        return (
          !isNaN(num) &&
          num >= POINTS_CONFIG.MIN_WEIGHT &&
          num <= POINTS_CONFIG.MAX_WEIGHT
        );
      },
      {
        message: `Berat sampah harus antara ${POINTS_CONFIG.MIN_WEIGHT}kg - ${POINTS_CONFIG.MAX_WEIGHT}kg`,
      },
    )
    .transform((val) => parseFloat(val)),
});

export const idTransactionSchema = z.object({
  id: z.string().min(1, "ID transaksi wajib diisi"),
});
