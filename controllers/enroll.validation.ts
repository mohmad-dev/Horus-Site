import { z } from 'zod';

const STUDENT_NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]{1,118}[\p{L}\p{M}]$/u;
const PHONE_RE = /^\+?[0-9]{7,15}$/;

const normalizePhone = (v: string) => v.trim().replace(/[^\d+]/g, '');

export const enrollSchema = z
  .object({
    studentName: z
      .string()
      .transform((s) => s.trim())
      .refine((s) => s.length > 0, 'studentName is required')
      .refine((s) => s.length <= 120, 'studentName is too long')
      .refine((s) => STUDENT_NAME_RE.test(s), 'studentName must be a valid human name'),
    phoneNumber: z
      .string()
      .transform(normalizePhone)
      .refine((s) => s.length > 0, 'phoneNumber is required')
      .refine((s) => PHONE_RE.test(s), 'phoneNumber must be digits (optionally starting with +), 7 to 15 digits'),
    courseSlug: z
      .string()
      .transform((s) => s.trim().toLowerCase())
      .refine((s) => s.length > 0, 'courseSlug is required')
      .refine((s) => s.length <= 220, 'courseSlug is too long'),
  })
  .strict();

export type EnrollInput = z.infer<typeof enrollSchema>;

