import { Routes } from '@angular/router';
import { CourseDetails } from './components/courses/coursesDetail/course-details/course-details';
import { LandingPage } from './components/landingPage/landing-page/landing-page';
import { Courses } from './components/courses/courses/courses';
import { AllCourses } from './components/courses/allCourses/all-courses/all-courses';
import { AdminDashboard } from './components/admin/admin-dashboard/admin-dashboard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    { path: '', component: LandingPage, title: 'أكاديمية حورس | الرئيسية' },
    { path: 'landing-page', component: LandingPage, title: 'أكاديمية حورس | الرئيسية' },
    {path : 'courses' , component : Courses , title : 'كورسات'} ,
    { path: 'course-details/:slug', component: CourseDetails, title: 'تفاصيل الكورس' },
    {path: 'all-courses' , component : AllCourses , title : 'كل الكورسات' },
    {
        path: 'admin',
        children: [
            { path: 'leads', component: AdminDashboard, canActivate: [adminGuard], title: 'لوحة الإدارة | الطلبات' },
        ],
    },
    { path: '**', redirectTo: '' }
];
