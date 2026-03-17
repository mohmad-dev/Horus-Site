import 'dotenv/config';

import mongoose from 'mongoose';
import { CourseModel } from '../models/Course';

type CurriculumChapter = { chapterTitle: string; lessons: string[] };

type CoursePatch = {
  title: string;
  slug: string;
  imageUrl: string;
  category: string;
  price: number;
  level: string;
  duration: string;
  description: string;
  aboutCourse: string;
  learningOutcomes: string[];
  requirements: string[];
  curriculum: CurriculumChapter[];
};

const patches: CoursePatch[] = [
  {
    title: 'JavaScript Programming Basics',
    slug: 'js-programming-basics',
    imageUrl:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
    category: 'Programming',
    price: 199,
    level: 'Beginner',
    duration: '4 weeks',
    description: 'Start coding from zero and learn the fundamentals of JavaScript.',
    aboutCourse:
      'A hands-on course focused on writing clean code and understanding variables, conditions, loops, functions, and basic DOM interaction.\nBy the end you will build two small projects.',
    learningOutcomes: ['JavaScript fundamentals', 'DOM basics', 'Build 2 mini projects'],
    requirements: ['A laptop/PC', 'Internet connection', 'Willingness to learn'],
    curriculum: [
      {
        chapterTitle: 'Core Fundamentals',
        lessons: ['Variables & types', 'Conditions & loops', 'Functions'],
      },
      {
        chapterTitle: 'Practical DOM',
        lessons: ['DOM intro', 'Events', 'Simple ToDo app'],
      },
    ],
  },
  {
    title: 'UI/UX Design Fundamentals',
    slug: 'ui-ux-design-fundamentals',
    imageUrl:
      'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80',
    category: 'Design',
    price: 149,
    level: 'Beginner',
    duration: '3 weeks',
    description: 'Learn UI and UX fundamentals to design clean, usable interfaces.',
    aboutCourse:
      'You will learn design principles (contrast, spacing, hierarchy), create wireframes, and build a clickable prototype in Figma.\nPerfect for anyone starting in product design.',
    learningOutcomes: ['Design principles', 'Wireframes & prototypes', 'UX thinking'],
    requirements: ['A computer', 'Figma (free)', 'Curiosity & taste for design'],
    curriculum: [
      { chapterTitle: 'Visual Design', lessons: ['Color', 'Typography', 'Grid & spacing'] },
      { chapterTitle: 'UX Process', lessons: ['User flow', 'Wireframes', 'Prototype in Figma'] },
    ],
  },
  {
    title: 'English for Tech & Business',
    slug: 'english-for-tech-business',
    imageUrl:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    category: 'Languages',
    price: 99,
    level: 'Intermediate',
    duration: '6 weeks',
    description: 'Improve your English for tech work, business communication, and interviews.',
    aboutCourse:
      'Focuses on technical vocabulary, professional emails, presentations, and speaking skills.\nIncludes weekly practice and short quizzes.',
    learningOutcomes: ['Write professional emails', 'Technical vocabulary', 'Interview preparation'],
    requirements: ['A2+ level', 'Time to practice', 'Notebook or notes app'],
    curriculum: [
      { chapterTitle: 'Business Basics', lessons: ['Emails', 'Meetings', 'Presentations'] },
      { chapterTitle: 'Tech English', lessons: ['Software terms', 'Bug reports', 'Interview Q&A'] },
    ],
  },
  {
    title: 'Entrepreneurship & Startup Basics',
    slug: 'entrepreneurship-startup-basics',
    imageUrl:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    category: 'Business',
    price: 179,
    level: 'Beginner',
    duration: '4 weeks',
    description: 'Turn an idea into a plan: validate, model, and launch your startup.',
    aboutCourse:
      'Learn how to test your idea, craft a value proposition, define customers, and build a simple MVP.\nIncludes practical templates and exercises.',
    learningOutcomes: ['Market analysis', 'Business Model Canvas', 'Go-to-market basics'],
    requirements: ['An idea (optional)', 'Experiment mindset', 'Weekly commitment'],
    curriculum: [
      { chapterTitle: 'Idea & Market', lessons: ['Problem/Solution', 'Personas', 'Competition'] },
      { chapterTitle: 'Model & Launch', lessons: ['MVP', 'Pricing', 'Go-to-market'] },
    ],
  },
  {
    title: 'Networking Essentials (CCNA Prep)',
    slug: 'networking-essentials-ccna',
    imageUrl:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    category: 'Networking',
    price: 229,
    level: 'Intermediate',
    duration: '5 weeks',
    description: 'Practical networking fundamentals aligned with CCNA concepts.',
    aboutCourse:
      'Covers OSI/TCP-IP, IP addressing, subnetting, routing & switching basics, and security best practices.\nIncludes labs and exercises.',
    learningOutcomes: ['Subnetting', 'Routing & switching basics', 'Network security fundamentals'],
    requirements: ['Basic computer skills', 'Packet Tracer (free)', 'Time for practice'],
    curriculum: [
      { chapterTitle: 'Fundamentals', lessons: ['OSI vs TCP/IP', 'IP addressing', 'Subnetting'] },
      { chapterTitle: 'Hands-on', lessons: ['Switching basics', 'Routing basics', 'Security basics'] },
    ],
  },
];

async function main() {
  const uri = process.env['MONGODB_URI'];
  if (!uri) throw new Error('Missing MONGODB_URI');

  await mongoose.connect(uri);
  try {
    for (const p of patches) {
      const r = await CourseModel.updateOne({ slug: p.slug }, { $set: p }).exec();
      console.log(`[PATCH] ${p.slug} matched=${r.matchedCount} modified=${r.modifiedCount}`);
    }
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error('repair-seeded-courses FAIL', err);
  process.exit(1);
});

