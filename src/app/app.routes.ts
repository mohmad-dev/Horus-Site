import { Routes } from '@angular/router';
import { CourseDetails } from './components/courses/coursesDetail/course-details/course-details';
import { LandingPage } from './components/landingPage/landing-page/landing-page';
import { Courses } from './components/courses/courses/courses';

export const routes: Routes = [
    {path : 'courses' , component : Courses , title : 'courses'} ,
    { path: '', component: LandingPage, title: 'أكاديمية حورس | الرئيسية' }, 
    { path: 'course-details', component: CourseDetails, title: 'تفاصيل الكورس' },
    { path: '**', redirectTo: '' }
];
