import response from "@/lib/response";
import { validate } from "@/lib/validate";
import { exampleSchema } from "@/schemas/main-schema";

export async function GET() {
  try {
    const data = {
      example: "test",
    };

    const validatedData = await validate(exampleSchema, data);

    // if validate failed
    if (!validatedData.success) {
      return response(400, validatedData.error);
    }

    return response(200, {
      message: "Hello World",
      ...validatedData.data,
    });
  } catch (err) {
    return response(500, err);
  }
}
