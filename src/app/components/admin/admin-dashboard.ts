import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-stone-50 flex font-sans">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-stone-200 flex flex-col">
        <div class="p-6 flex items-center gap-3">
          <div class="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center text-white">
            <mat-icon>school</mat-icon>
          </div>
          <span class="font-bold text-stone-900">EduSmart</span>
        </div>

        <nav class="flex-1 px-4 space-y-2">
          <button 
            (click)="activeTab.set('school')"
            [class.bg-stone-100]="activeTab() === 'school'"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-all"
          >
            <mat-icon [class.text-stone-900]="activeTab() === 'school'">domain</mat-icon>
            <span class="font-medium">School Overview</span>
          </button>
          <button 
            (click)="activeTab.set('teachers')"
            [class.bg-stone-100]="activeTab() === 'teachers'"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-all"
          >
            <mat-icon [class.text-stone-900]="activeTab() === 'teachers'">person_pin</mat-icon>
            <span class="font-medium">Teachers</span>
          </button>
          <button 
            (click)="activeTab.set('students')"
            [class.bg-stone-100]="activeTab() === 'students'"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-all"
          >
            <mat-icon [class.text-stone-900]="activeTab() === 'students'">groups</mat-icon>
            <span class="font-medium">Students</span>
          </button>
          <button 
            (click)="activeTab.set('settings')"
            [class.bg-stone-100]="activeTab() === 'settings'"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-all"
          >
            <mat-icon [class.text-stone-900]="activeTab() === 'settings'">settings</mat-icon>
            <span class="font-medium">Settings</span>
          </button>
        </nav>

        <div class="p-4 border-t border-stone-100">
          <div class="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
            <div class="w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center font-bold text-xs uppercase">
              {{ auth.currentUser()?.name?.charAt(0) }}
            </div>
            <div class="flex-1 overflow-hidden">
              <p class="text-xs font-bold text-stone-900 truncate">{{ auth.currentUser()?.name }}</p>
              <p class="text-[10px] text-stone-500 truncate">Administrator</p>
            </div>
            <button (click)="auth.logout()" class="text-stone-400 hover:text-red-500">
              <mat-icon class="text-sm">logout</mat-icon>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col overflow-hidden">
        <header class="h-16 bg-white border-b border-stone-200 px-8 flex items-center justify-between">
          <h2 class="text-lg font-bold text-stone-900 capitalize">{{ activeTab() }}</h2>
          <div class="flex items-center gap-4">
            <div class="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-xs font-bold">
              System Status: Healthy
            </div>
          </div>
        </header>

        <div class="flex-1 overflow-y-auto p-8">
          
          <!-- School Overview Tab -->
          @if (activeTab() === 'school') {
            <div class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <p class="text-xs text-stone-400 uppercase font-bold mb-1">Total Students</p>
                  <p class="text-3xl font-bold text-stone-900">1,240</p>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <p class="text-xs text-stone-400 uppercase font-bold mb-1">Total Teachers</p>
                  <p class="text-3xl font-bold text-stone-900">86</p>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <p class="text-xs text-stone-400 uppercase font-bold mb-1">Active Classes</p>
                  <p class="text-3xl font-bold text-stone-900">42</p>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <p class="text-xs text-stone-400 uppercase font-bold mb-1">AI Usage (Tokens)</p>
                  <p class="text-3xl font-bold text-stone-900">2.4M</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
                  <h3 class="text-xl font-bold mb-6">Recent Registrations</h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">JD</div>
                        <span class="font-bold text-sm">John Doe (Student)</span>
                      </div>
                      <span class="text-[10px] text-stone-400 font-bold">10 mins ago</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xs">MS</div>
                        <span class="font-bold text-sm">Mary Smith (Teacher)</span>
                      </div>
                      <span class="text-[10px] text-stone-400 font-bold">1 hour ago</span>
                    </div>
                  </div>
                </div>

                <div class="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
                  <h3 class="text-xl font-bold mb-6">System Alerts</h3>
                  <div class="space-y-4">
                    <div class="flex items-center gap-3 p-3 bg-red-50 text-red-700 rounded-xl border border-red-100">
                      <mat-icon class="text-sm">warning</mat-icon>
                      <span class="text-sm font-medium">Server load high in Region A</span>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                      <mat-icon class="text-sm">info</mat-icon>
                      <span class="text-sm font-medium">New AI model update available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Teachers Tab -->
          @if (activeTab() === 'teachers') {
            <div class="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div class="p-6 border-b border-stone-200 flex justify-between items-center">
                <h3 class="font-bold">Faculty Directory</h3>
                <button class="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-bold hover:bg-stone-800 transition-all">Add New Teacher</button>
              </div>
              <table class="w-full text-left">
                <thead class="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th class="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Name</th>
                    <th class="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Department</th>
                    <th class="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Students</th>
                    <th class="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                  <tr class="hover:bg-stone-50 transition-all">
                    <td class="px-6 py-4 font-bold text-stone-900">Dr. Sarah Connor</td>
                    <td class="px-6 py-4 text-sm text-stone-600">Physics</td>
                    <td class="px-6 py-4 text-sm text-stone-600">45</td>
                    <td class="px-6 py-4"><span class="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Active</span></td>
                  </tr>
                  <tr class="hover:bg-stone-50 transition-all">
                    <td class="px-6 py-4 font-bold text-stone-900">Prof. James Moriarty</td>
                    <td class="px-6 py-4 text-sm text-stone-600">Mathematics</td>
                    <td class="px-6 py-4 text-sm text-stone-600">32</td>
                    <td class="px-6 py-4"><span class="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Active</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          }

          <!-- Settings Tab -->
          @if (activeTab() === 'settings') {
            <div class="max-w-2xl space-y-6">
              <div class="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
                <h3 class="text-xl font-bold mb-6">General Settings</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 border border-stone-100 rounded-xl">
                    <div>
                      <p class="font-bold text-sm">AI Playground Access</p>
                      <p class="text-xs text-stone-500">Allow students to use AI Playground</p>
                    </div>
                    <div class="w-12 h-6 bg-emerald-500 rounded-full relative">
                      <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between p-4 border border-stone-100 rounded-xl">
                    <div>
                      <p class="font-bold text-sm">Teacher AI Prep</p>
                      <p class="text-xs text-stone-500">Enable AI lesson planning for teachers</p>
                    </div>
                    <div class="w-12 h-6 bg-emerald-500 rounded-full relative">
                      <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
    mat-icon { font-size: 20px; width: 20px; height: 20px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboard {
  auth = inject(AuthService);
  activeTab = signal<'school' | 'teachers' | 'students' | 'settings'>('school');
}
