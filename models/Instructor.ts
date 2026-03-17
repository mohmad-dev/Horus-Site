import mongoose, { HydratedDocument, Model, Schema } from 'mongoose';

export interface Instructor {
  name: string;
  role: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InstructorDocument = HydratedDocument<Instructor>;

const normalizeText = (v: unknown) => (typeof v === 'string' ? v.trim() : v);

const InstructorSchema = new Schema<Instructor>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
      set: normalizeText,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
      set: normalizeText,
    },
    bio: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
      set: normalizeText,
    },
  },
  {
    timestamps: true,
    minimize: false,
    versionKey: false,
  },
);

export const InstructorModel: Model<Instructor> =
  (mongoose.models['Instructor'] as Model<Instructor> | undefined) ||
  mongoose.model<Instructor>('Instructor', InstructorSchema);

