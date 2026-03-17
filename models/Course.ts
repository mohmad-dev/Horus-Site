import mongoose, { HydratedDocument, Model, Schema, Types } from 'mongoose';
import slugify from 'slugify';

export interface Course {
  title: string;
  slug: string;
  imageUrl: string;
  description: string;
  aboutCourse: string;
  category: string;
  price: number;
  level: string;
  duration: string;
  learningOutcomes: string[];
  requirements: string[];
  curriculum: Array<{
    chapterTitle: string;
    lessons: string[];
  }>;
  instructor?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type CourseDocument = HydratedDocument<Course>;

const normalizeText = (v: unknown) => (typeof v === 'string' ? v.trim() : v);

function makeBaseSlug(title: string): string {
  const s = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
    locale: 'en',
  });
  return s || 'course';
}

async function ensureUniqueSlug(
  doc: CourseDocument,
  model: Model<Course>,
  baseSlug: string,
): Promise<string> {
  const escaped = baseSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^${escaped}(?:-(\\d+))?$`, 'i');

  const matches = await model
    .find(
      { slug: regex, _id: { $ne: doc._id } },
      { slug: 1 },
      { lean: true },
    )
    .exec();

  if (matches.length === 0) return baseSlug;

  let maxSuffix = 0;
  for (const m of matches) {
    const slug = String((m as any).slug || '');
    const suffix = slug.slice(baseSlug.length + 1);
    if (!suffix) {
      maxSuffix = Math.max(maxSuffix, 0);
      continue;
    }
    const n = Number.parseInt(suffix, 10);
    if (Number.isFinite(n)) maxSuffix = Math.max(maxSuffix, n);
  }

  return `${baseSlug}-${maxSuffix + 1}`;
}

const CurriculumSchema = new Schema(
  {
    chapterTitle: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
      set: normalizeText,
    },
    lessons: {
      type: [String],
      required: true,
      validate: [
        {
          validator: (v: unknown) => Array.isArray(v) && v.length > 0,
          message: 'curriculum.lessons must have at least 1 item',
        },
        {
          validator: (v: unknown) =>
            Array.isArray(v) &&
            v.every((x) => typeof x === 'string' && x.trim().length > 0 && x.trim().length <= 200),
          message: 'curriculum.lessons items must be non-empty strings (max 200 chars)',
        },
      ],
      set: (arr: unknown) =>
        Array.isArray(arr) ? arr.map((x) => (typeof x === 'string' ? x.trim() : x)) : arr,
    },
  },
  { _id: false },
);

const CourseSchema = new Schema<Course>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
      set: normalizeText,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 1,
      maxlength: 220,
      index: true,
      unique: true,
      set: normalizeText,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2048,
      set: normalizeText,
      validate: {
        validator: (v: string) =>
          typeof v === 'string' &&
          (v.startsWith('/') || v.startsWith('http://') || v.startsWith('https://')),
        message: 'imageUrl must be a relative path (/...) or an http(s) URL',
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
      set: normalizeText,
    },
    aboutCourse: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 10000,
      set: normalizeText,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      set: normalizeText,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000,
      validate: {
        validator: (v: number) => Number.isFinite(v),
        message: 'price must be a finite number',
      },
    },
    level: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
      set: normalizeText,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
      set: normalizeText,
    },
    learningOutcomes: {
      type: [String],
      required: true,
      validate: [
        {
          validator: (v: unknown) => Array.isArray(v) && v.length > 0,
          message: 'learningOutcomes must have at least 1 item',
        },
        {
          validator: (v: unknown) =>
            Array.isArray(v) &&
            v.every((x) => typeof x === 'string' && x.trim().length > 0 && x.trim().length <= 200),
          message: 'learningOutcomes items must be non-empty strings (max 200 chars)',
        },
      ],
      set: (arr: unknown) =>
        Array.isArray(arr) ? arr.map((x) => (typeof x === 'string' ? x.trim() : x)) : arr,
    },
    requirements: {
      type: [String],
      required: true,
      validate: [
        {
          validator: (v: unknown) => Array.isArray(v) && v.length > 0,
          message: 'requirements must have at least 1 item',
        },
        {
          validator: (v: unknown) =>
            Array.isArray(v) &&
            v.every((x) => typeof x === 'string' && x.trim().length > 0 && x.trim().length <= 200),
          message: 'requirements items must be non-empty strings (max 200 chars)',
        },
      ],
      set: (arr: unknown) =>
        Array.isArray(arr) ? arr.map((x) => (typeof x === 'string' ? x.trim() : x)) : arr,
    },
    curriculum: {
      type: [CurriculumSchema],
      required: true,
      validate: {
        validator: (v: unknown) => Array.isArray(v) && v.length > 0,
        message: 'curriculum must have at least 1 chapter',
      },
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'Instructor',
      required: false,
    },
  },
  {
    timestamps: true,
    minimize: false,
    versionKey: false,
  },
);

CourseSchema.index({ slug: 1 }, { unique: true });

(CourseSchema as any).pre('validate', async function preValidate(this: CourseDocument) {
  const doc = this as CourseDocument;
  const model = doc.constructor as Model<Course>;

  // Respect an explicitly-provided slug on creation; only generate when missing
  // or when title changes without an accompanying slug change.
  const shouldGenerateSlug =
    !doc.slug || (doc.isModified('title') && !doc.isModified('slug'));

  if (shouldGenerateSlug) {
    const base = makeBaseSlug(doc.title);
    doc.slug = await ensureUniqueSlug(doc, model, base);
  }
});

export const CourseModel: Model<Course> =
  (mongoose.models['Course'] as Model<Course> | undefined) ||
  mongoose.model<Course>('Course', CourseSchema);

