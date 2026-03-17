import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CourseModel } from '../models/Course';
import { EnrollmentLeadModel } from '../models/EnrollmentLead';
import { fail, failWithDetails, isMongooseValidationError, ok } from './_http';
import { createCourseSchema } from './admin.validation';

export async function getEnrollments(req: Request, res: Response) {
  try {
    const leads = await EnrollmentLeadModel.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return ok(res, leads, 200);
  } catch {
    return fail(res, 500, 'INTERNAL_SERVER_ERROR');
  }
}

export async function createCourse(req: Request, res: Response) {
  try {
    const parsed = createCourseSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return failWithDetails(res, 400, 'VALIDATION_ERROR', parsed.error.flatten());
    }

    const { instructor, ...rest } = parsed.data;
    const instructorId =
      instructor && mongoose.isValidObjectId(instructor)
        ? new mongoose.Types.ObjectId(instructor)
        : undefined;

    const created = await CourseModel.create({
      ...rest,
      ...(instructorId ? { instructor: instructorId } : {}),
    });

    return ok(res, created.toObject(), 201);
  } catch (err: unknown) {
    if (isMongooseValidationError(err)) {
      return failWithDetails(res, 400, 'VALIDATION_ERROR', err.errors);
    }
    console.error('createCourse failed', err);
    return fail(res, 500, 'INTERNAL_SERVER_ERROR');
  }
}

