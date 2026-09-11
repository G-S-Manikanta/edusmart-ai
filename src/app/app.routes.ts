import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.Login)
  },
  {
    path: 'student',
    loadComponent: () => import('./components/student/student-dashboard').then(m => m.StudentDashboard)
  },
  {
    path: 'teacher',
    loadComponent: () => import('./components/teacher/teacher-dashboard').then(m => m.TeacherDashboard)
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin-dashboard').then(m => m.AdminDashboard)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
