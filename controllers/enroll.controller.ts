import type { Request, Response } from 'express';
import { CourseModel } from '../models/Course';
import { EnrollmentLeadModel } from '../models/EnrollmentLead';
import {
  fail,
  failWithDetails,
  failWithMessage,
  isMongooseValidationError,
  ok,
  toLowerTrimmed,
  toTrimmed,
} from './_http';
import { enrollSchema } from './enroll.validation';

type EnrollBody = {
  studentName?: unknown;
  phoneNumber?: unknown;
  courseSlug?: unknown;
};

export async function enroll(req: Request, res: Response) {
  try {
    const raw = (req.body ?? {}) as EnrollBody;

    // keep the existing "required fields" message/shape
    const requiredStudentName = toTrimmed(raw.studentName);
    const requiredPhoneNumber = toTrimmed(raw.phoneNumber);
    const requiredCourseSlug = toLowerTrimmed(raw.courseSlug);
    if (!requiredStudentName || !requiredPhoneNumber || !requiredCourseSlug) {
      return failWithMessage(
        res,
        400,
        'VALIDATION_ERROR',
        'studentName, phoneNumber, and courseSlug are required',
      );
    }

    const parsed = enrollSchema.safeParse({
      studentName: requiredStudentName,
      phoneNumber: requiredPhoneNumber,
      courseSlug: requiredCourseSlug,
    });

    if (!parsed.success) {
      return failWithDetails(res, 400, 'VALIDATION_ERROR', parsed.error.flatten());
    }

    const { studentName, phoneNumber, courseSlug } = parsed.data;

    const course = await CourseModel.findOne({ slug: courseSlug }).exec();
    if (!course) {
      return fail(res, 404, 'COURSE_NOT_FOUND');
    }

    const lead = await EnrollmentLeadModel.create({
      studentName,
      phoneNumber,
      course: course._id,
      courseSlug: course.slug,
    });

    return ok(
      res,
      {
        id: lead._id,
        courseSlug: lead.courseSlug,
        createdAt: lead.createdAt,
      },
      201,
    );
  } catch (err: unknown) {
    if (isMongooseValidationError(err)) {
      return failWithDetails(res, 400, 'VALIDATION_ERROR', err.errors);
    }
    return fail(res, 500, 'INTERNAL_SERVER_ERROR');
  }
}

