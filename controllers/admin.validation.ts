import { z } from 'zod';

export const createCourseSchema = z
  .object({
    title: z.string().trim().min(2).max(200),
    imageUrl: z
      .string()
      .trim()
      .min(1)
      .max(2048)
      .refine((s: string) => s.startsWith('/') || s.startsWith('http://') || s.startsWith('https://'), {
        message: 'imageUrl must be a relative path (/...) or an http(s) URL',
      }),
    description: z.string().trim().min(10).max(500),
    aboutCourse: z.string().trim().min(20).max(10000),
    category: z.string().trim().min(2).max(100),
    price: z.number().finite().min(0).max(1000000),
    level: z.string().trim().min(1).max(100),
    duration: z.string().trim().min(1).max(100),
    learningOutcomes: z
      .array(z.string().trim().min(1).max(200))
      .min(1)
      .max(200),
    requirements: z
      .array(z.string().trim().min(1).max(200))
      .min(1)
      .max(200),
    curriculum: z
      .array(
        z
          .object({
            chapterTitle: z.string().trim().min(1).max(200),
            lessons: z.array(z.string().trim().min(1).max(200)).min(1).max(500),
          })
          .strict(),
      )
      .min(1)
      .max(200),
    instructor: z.string().trim().optional(),
  })
  .strict();

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

