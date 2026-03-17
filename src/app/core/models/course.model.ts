export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: string;
  message?: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

// Matches backend CourseModel (lean JSON shape).
export interface Course {
  _id: string;
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
  instructor?: string;
  createdAt: string;
  updatedAt: string;
}

