import { Role } from "@/lib/enum";
import z from "zod";

export const UserUpdateSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong").optional(),
  email: z.email("Email tidak valid").optional(),
  role: z.enum(Role).optional(),
});

export const PetugasUpdateSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong").optional(),
  email: z.email("Email tidak valid").optional(),
});
