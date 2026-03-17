import type { Response } from 'express';
import type { Error as MongooseError } from 'mongoose';

export type ApiSuccess<T> = { success: true; data: T };
export type ApiErrorBase = { success: false; error: string };
export type ApiErrorWithMessage = ApiErrorBase & { message: string };
export type ApiErrorWithDetails = ApiErrorBase & { details: unknown };

export function ok<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ success: true, data } satisfies ApiSuccess<T>);
}

export function fail(res: Response, status: number, error: string) {
  return res.status(status).json({ success: false, error } satisfies ApiErrorBase);
}

export function failWithMessage(res: Response, status: number, error: string, message: string) {
  return res
    .status(status)
    .json({ success: false, error, message } satisfies ApiErrorWithMessage);
}

export function failWithDetails(res: Response, status: number, error: string, details: unknown) {
  return res
    .status(status)
    .json({ success: false, error, details } satisfies ApiErrorWithDetails);
}

export function isMongooseValidationError(err: unknown): err is MongooseError.ValidationError {
  return typeof err === 'object' && err !== null && (err as any).name === 'ValidationError';
}

export function toLowerTrimmed(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export function toTrimmed(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

