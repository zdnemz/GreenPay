import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nama minimal 2 karakter")
      .max(50, "Nama maksimal 50 karakter")
      .optional(),

    email: z.email("Format email tidak valid").optional(),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined, {
    message: "Minimal isi salah satu: Nama atau Email",
    path: ["name"], // bisa juga 'email'
  });
