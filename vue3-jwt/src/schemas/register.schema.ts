import { toTypedSchema } from "@vee-validate/zod";
import z from "zod";

export const registerSchema = toTypedSchema(
  z
    .object({
      username: z
        .string()
        .min(3, 'Username minimal 3 karakter'),
      password: z
        .string()
        .min(6, 'Password minimal 6 karakter'),
      confirmPassword: z
        .string()
        .min(6, 'Konfirmasi password minimal 6 karakter'),
      role: z.enum(['USER', 'ADMIN']),
    })
    .refine(
      (data) => data.password === data.confirmPassword,
      {
        message: 'Password tidak sama',
        path: ['confirmPassword']
      }
    )
)