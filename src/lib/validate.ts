import { z, ZodSchema } from "zod";

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type Infer<T extends z.ZodType> = z.infer<T>;

export async function validate<T extends ZodSchema>(
  schema: T,
  data: unknown,
): Promise<ValidationResult<z.infer<T>>> {
  try {
    const parsed = await schema.parseAsync(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError<z.infer<T>>;
      return {
        success: false,
        error: zodError.issues[0]?.message ?? "Invalid input",
      };
    }
    return { success: false, error: "Validation failed" };
  }
}
