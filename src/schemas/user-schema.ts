import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .transform((val) => (val.trim() === "" ? undefined : val.trim()))
      .optional()
      .refine((val) => !val || val.length >= 2, {
        message: "Nama minimal 2 karakter",
      })
      .refine((val) => !val || val.length <= 50, {
        message: "Nama maksimal 50 karakter",
      }),

    email: z
      .string()
      .transform((val) => (val.trim() === "" ? undefined : val.trim()))
      .optional()
      .refine((val) => !val || z.email().safeParse(val).success, {
        message: "Format email tidak valid",
      }),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined, {
    message: "Minimal isi salah satu: Nama atau Email",
    path: ["name"],
  });
