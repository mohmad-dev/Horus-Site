import 'dotenv/config';

import mongoose from 'mongoose';
import { CourseModel } from '../models/Course';

const desiredByTitle: Record<string, string> = {
  'أساسيات البرمجة بـ JavaScript': 'js-programming-basics',
  'UI/UX Design Fundamentals': 'ui-ux-design-fundamentals',
  'English for Tech & Business': 'english-for-tech-business',
  'Entrepreneurship & Startup Basics': 'entrepreneurship-startup-basics',
  'Networking Essentials (CCNA Prep)': 'networking-essentials-ccna',
};

async function main() {
  const uri = process.env['MONGODB_URI'];
  if (!uri) throw new Error('Missing MONGODB_URI');

  await mongoose.connect(uri);
  try {
    for (const [title, slug] of Object.entries(desiredByTitle)) {
      const existing = await CourseModel.findOne({ title }).select({ _id: 1, title: 1, slug: 1 }).lean().exec();
      if (!existing) {
        console.log(`[MISS] ${title}`);
        continue;
      }

      const r = await CourseModel.updateOne({ _id: existing._id }, { $set: { slug } }).exec();
      console.log(`[OK] ${title} :: ${existing.slug} -> ${slug} (modified=${r.modifiedCount})`);
    }

    // Fallback: if a title got corrupted on insert, fix by previous slug.
    const fallback = await CourseModel.findOne({ slug: 'javascript' }).select({ _id: 1, title: 1, slug: 1 }).lean().exec();
    if (fallback) {
      const r = await CourseModel.updateOne({ _id: fallback._id }, { $set: { slug: 'js-programming-basics' } }).exec();
      console.log(
        `[OK] fallback(slug=javascript) :: ${fallback.title} -> js-programming-basics (modified=${r.modifiedCount})`,
      );
    }
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error('fix-course-slugs FAIL', err);
  process.exit(1);
});

