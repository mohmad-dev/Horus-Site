import type { Request, Response } from 'express';
import { CourseModel } from '../models/Course';
import { fail, ok, toLowerTrimmed } from './_http';

export async function getCourses(req: Request, res: Response) {
  try {
    const courses = await CourseModel.find().sort({ createdAt: -1 }).lean().exec();
    return ok(res, courses, 200);
  } catch {
    return fail(res, 500, 'INTERNAL_SERVER_ERROR');
  }
}

export async function getCourseBySlug(req: Request, res: Response) {
  try {
    const slug = toLowerTrimmed(req.params['slug']);
    if (!slug) {
      return fail(res, 400, 'INVALID_SLUG');
    }

    const course = await CourseModel.findOne({ slug }).lean().exec();
    if (!course) {
      return fail(res, 404, 'COURSE_NOT_FOUND');
    }

    return ok(res, course, 200);
  } catch {
    return fail(res, 500, 'INTERNAL_SERVER_ERROR');
  }
}

