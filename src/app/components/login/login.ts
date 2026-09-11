import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UserRole } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-stone-100 flex items-center justify-center p-4 font-sans">
      <div class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-black/5">
        <div class="p-8">
          <div class="flex justify-center mb-6">
            <div class="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <mat-icon class="text-white text-3xl">school</mat-icon>
            </div>
          </div>
          
          <h1 class="text-2xl font-bold text-center text-stone-900 mb-2">EduSmart AI</h1>
          <p class="text-stone-500 text-center mb-8">Welcome back! Please select your role and login.</p>

          <div class="space-y-4">
            <div>
              <label for="email-input" class="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
              <input 
                id="email-input"
                type="email" 
                [(ngModel)]="email"
                class="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="name@school.edu"
              >
            </div>

            <div>
              <span class="block text-sm font-medium text-stone-700 mb-1">Login as</span>
              <div class="grid grid-cols-3 gap-3">
                <button 
                  (click)="role = 'student'"
                  [class.bg-emerald-50]="role === 'student'"
                  [class.border-emerald-500]="role === 'student'"
                  class="flex flex-col items-center p-3 border border-stone-200 rounded-xl hover:border-emerald-500 transition-all group"
                >
                  <mat-icon [class.text-emerald-600]="role === 'student'" class="text-stone-400 group-hover:text-emerald-600">person</mat-icon>
                  <span class="text-xs mt-1 font-medium">Student</span>
                </button>
                <button 
                  (click)="role = 'teacher'"
                  [class.bg-emerald-50]="role === 'teacher'"
                  [class.border-emerald-500]="role === 'teacher'"
                  class="flex flex-col items-center p-3 border border-stone-200 rounded-xl hover:border-emerald-500 transition-all group"
                >
                  <mat-icon [class.text-emerald-600]="role === 'teacher'" class="text-stone-400 group-hover:text-emerald-600">co_present</mat-icon>
                  <span class="text-xs mt-1 font-medium">Teacher</span>
                </button>
                <button 
                  (click)="role = 'admin'"
                  [class.bg-emerald-50]="role === 'admin'"
                  [class.border-emerald-500]="role === 'admin'"
                  class="flex flex-col items-center p-3 border border-stone-200 rounded-xl hover:border-emerald-500 transition-all group"
                >
                  <mat-icon [class.text-emerald-600]="role === 'admin'" class="text-stone-400 group-hover:text-emerald-600">admin_panel_settings</mat-icon>
                  <span class="text-xs mt-1 font-medium">Admin</span>
                </button>
              </div>
            </div>

            <button 
              (click)="onLogin()"
              [disabled]="!email || !role"
              class="w-full bg-stone-900 text-white py-3 rounded-xl font-semibold hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-4"
            >
              Sign In
              <mat-icon class="text-sm">arrow_forward</mat-icon>
            </button>
          </div>
        </div>
        
        <div class="bg-stone-50 p-4 border-t border-stone-100 text-center">
          <p class="text-xs text-stone-400">Powered by Gemini AI • EduSmart v1.0</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    mat-icon { font-size: 24px; width: 24px; height: 24px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private auth = inject(AuthService);
  
  email = '';
  role: UserRole = null;

  onLogin() {
    if (this.email && this.role) {
      this.auth.login(this.email, this.role);
    }
  }
}
