import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    path: 'landing-page',
    renderMode: RenderMode.Server,
  },
  {
    path: 'courses',
    renderMode: RenderMode.Server,
  },
  {
    path: 'all-courses',
    renderMode: RenderMode.Server,
  },
  {
    path: 'course-details/:slug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/leads',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
