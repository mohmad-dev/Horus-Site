import mongoose, { HydratedDocument, Model, Schema, Types } from 'mongoose';

export interface EnrollmentLead {
  studentName: string;
  phoneNumber: string;
  course: Types.ObjectId;
  courseSlug: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EnrollmentLeadDocument = HydratedDocument<EnrollmentLead>;

const normalizeText = (v: unknown) => (typeof v === 'string' ? v.trim() : v);

const STUDENT_NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]{1,118}[\p{L}\p{M}]$/u;
const PHONE_RE = /^\+?[0-9]{7,15}$/;

const EnrollmentLeadSchema = new Schema<EnrollmentLead>(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
      set: normalizeText,
      validate: {
        validator: (v: string) => STUDENT_NAME_RE.test(v),
        message: 'studentName must be a valid human name',
      },
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      maxlength: 20,
      set: (v: unknown) => {
        if (typeof v !== 'string') return v as any;
        const trimmed = v.trim();
        const normalized = trimmed.replace(/[^\d+]/g, '');
        return normalized;
      },
      validate: {
        validator: (v: string) => PHONE_RE.test(v),
        message: 'phoneNumber must be digits (optionally starting with +), 7 to 15 digits',
      },
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    courseSlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 1,
      maxlength: 220,
      index: true,
      set: normalizeText,
    },
  },
  {
    timestamps: true,
    minimize: false,
    versionKey: false,
  },
);

EnrollmentLeadSchema.pre('validate', function preValidate() {
  const doc = this as EnrollmentLeadDocument;
  if (doc.courseSlug) doc.courseSlug = doc.courseSlug.toLowerCase().trim();
});

export const EnrollmentLeadModel: Model<EnrollmentLead> =
  (mongoose.models['EnrollmentLead'] as Model<EnrollmentLead> | undefined) ||
  mongoose.model<EnrollmentLead>('EnrollmentLead', EnrollmentLeadSchema);

