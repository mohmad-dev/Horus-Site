import 'dotenv/config';

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import mongoose from 'mongoose';
import { z } from 'zod';
import { CourseModel } from '../models/Course';

const curriculumSchema = z.object({
  chapterTitle: z.string().min(1),
  lessons: z.array(z.string().min(1)).min(1),
});

const courseSeedSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(1).optional(),
  imageUrl: z.string().min(1),
  description: z.string().min(10),
  aboutCourse: z.string().min(20),
  category: z.string().min(2),
  price: z.number().finite().min(0),
  level: z.string().min(1),
  duration: z.string().min(1),
  learningOutcomes: z.array(z.string().min(1)).min(1),
  requirements: z.array(z.string().min(1)).min(1),
  curriculum: z.array(curriculumSchema).min(1),
  instructor: z.string().optional(),
});

const seedFileSchema = z.object({
  courses: z.array(courseSeedSchema).min(1),
});

type SeedCourse = z.infer<typeof courseSeedSchema>;

function maskMongoUri(uri: string): string {
  const schemeIdx = uri.indexOf('://');
  const atIdx = uri.indexOf('@');
  if (schemeIdx === -1 || atIdx === -1) return uri;
  const creds = uri.slice(schemeIdx + 3, atIdx);
  const colonIdx = creds.indexOf(':');
  if (colonIdx === -1) return uri;
  const user = creds.slice(0, colonIdx);
  return `${uri.slice(0, schemeIdx + 3)}${user}:***${uri.slice(atIdx)}`;
}

async function upsertCourse(c: SeedCourse) {
  const filter = c.slug ? { slug: c.slug } : { title: c.title };

  const update: any = {
    title: c.title,
    imageUrl: c.imageUrl,
    description: c.description,
    aboutCourse: c.aboutCourse,
    category: c.category,
    price: c.price,
    level: c.level,
    duration: c.duration,
    learningOutcomes: c.learningOutcomes,
    requirements: c.requirements,
    curriculum: c.curriculum,
  };

  if (c.slug) update.slug = c.slug;
  if (c.instructor) update.instructor = c.instructor;

  await CourseModel.findOneAndUpdate(filter, update, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
    runValidators: true,
  }).exec();
}

async function main() {
  const uri = process.env['MONGODB_URI'];
  if (!uri) {
    console.error('Missing MONGODB_URI in environment.');
    process.exit(1);
  }

  const seedPath = resolve(process.cwd(), 'scripts', 'courses.seed.json');
  const raw = readFileSync(seedPath, 'utf8');
  const parsedJson = JSON.parse(raw);
  const seed = seedFileSchema.parse(parsedJson);

  console.log('Connecting to:', maskMongoUri(uri));
  await mongoose.connect(uri);

  try {
    for (const c of seed.courses) {
      await upsertCourse(c);
      console.log('Upserted:', c.slug ?? c.title);
    }
    console.log('Done.');
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error('Seed FAIL:', err?.message ?? err);
  process.exit(1);
});

