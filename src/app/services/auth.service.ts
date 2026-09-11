import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export type UserRole = 'student' | 'teacher' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  currentUser = signal<User | null>(null);

  constructor() {
    // Check local storage for session
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('edusmart_user');
      if (savedUser) {
        this.currentUser.set(JSON.parse(savedUser));
      }
    }
  }

  login(email: string, role: UserRole) {
    const user: User = {
      id: Math.random().toString(36).substring(7),
      name: email.split('@')[0],
      role: role,
      email: email
    };
    this.currentUser.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('edusmart_user', JSON.stringify(user));
    }
    this.redirectBasedOnRole(role);
  }

  logout() {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('edusmart_user');
    }
    this.router.navigate(['/login']);
  }

  private redirectBasedOnRole(role: UserRole) {
    if (role === 'student') this.router.navigate(['/student']);
    else if (role === 'teacher') this.router.navigate(['/teacher']);
    else if (role === 'admin') this.router.navigate(['/admin']);
    else this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return this.currentUser() !== null;
  }

  hasRole(role: UserRole) {
    return this.currentUser()?.role === role;
  }
}
