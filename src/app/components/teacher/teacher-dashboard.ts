import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AiService } from '../../services/ai.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-stone-50 flex font-sans">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-stone-200 flex flex-col">
        <div class="p-6 flex items-center gap-3">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <mat-icon>school</mat-icon>
          </div>
          <span class="font-bold text-stone-900">EduSmart</span>
        </div>

        <nav class="flex-1 px-4 space-y-2">
          <button 
            (click)="activeTab.set('overview')"
            [class.bg-stone-100]="activeTab() === 'overview'"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-all"
          >
            <mat-icon [class.text-indigo-600]="activeTab() === 'overview'">analytics</mat-icon>
            <span class="font-medium">Overview</span>
          </button>
          <button 
            (click)="activeTab.set('students')"
            [class.bg-stone-100]="activeTab() === 'students'"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-all"
          >
            <mat-icon [class.text-indigo-600]="activeTab() === 'students'">groups</mat-icon>
            <span class="font-medium">My Students</span>
          </button>
          <button 
            (click)="activeTab.set('lesson-prep')"
            [class.bg-stone-100]="activeTab() === 'lesson-prep'"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-all"
          >
            <mat-icon [class.text-indigo-600]="activeTab() === 'lesson-prep'">auto_awesome</mat-icon>
            <span class="font-medium">AI Lesson Prep</span>
          </button>
          <button 
            (click)="activeTab.set('tests')"
            [class.bg-stone-100]="activeTab() === 'tests'"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-all"
          >
            <mat-icon [class.text-indigo-600]="activeTab() === 'tests'">post_add</mat-icon>
            <span class="font-medium">Create Test</span>
          </button>
        </nav>

        <div class="p-4 border-t border-stone-100">
          <div class="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
            <div class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
              {{ auth.currentUser()?.name?.charAt(0)?.toUpperCase() }}
            </div>
            <div class="flex-1 overflow-hidden">
              <p class="text-xs font-bold text-stone-900 truncate">{{ auth.currentUser()?.name }}</p>
              <p class="text-[10px] text-stone-500 truncate">Teacher Account</p>
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
            <div class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
              Teacher Performance: 92%
            </div>
          </div>
        </header>

        <div class="flex-1 overflow-y-auto p-8">
          
          <!-- Overview Tab -->
          @if (activeTab() === 'overview') {
            <div class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <p class="text-xs text-stone-400 uppercase font-bold mb-1">Total Students</p>
                  <p class="text-3xl font-bold text-stone-900">124</p>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <p class="text-xs text-stone-400 uppercase font-bold mb-1">Avg Grade</p>
                  <p class="text-3xl font-bold text-stone-900">B+</p>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <p class="text-xs text-stone-400 uppercase font-bold mb-1">Pass Rate</p>
                  <p class="text-3xl font-bold text-stone-900">98%</p>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <p class="text-xs text-stone-400 uppercase font-bold mb-1">Tests Created</p>
                  <p class="text-3xl font-bold text-stone-900">18</p>
                </div>
              </div>

              <div class="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
                <h3 class="text-xl font-bold mb-6">Class Performance Trend</h3>
                <div class="h-64 flex items-end gap-4 px-4">
                  @for (val of [40, 65, 55, 85, 75, 95, 90]; track $index) {
                    <div class="flex-1 flex flex-col items-center gap-2">
                      <div [style.height.%]="val" class="w-full bg-indigo-500 rounded-t-lg opacity-80 hover:opacity-100 transition-all"></div>
                      <span class="text-[10px] text-stone-400 font-bold uppercase">Week {{ $index + 1 }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          }

          <!-- AI Lesson Prep Tab -->
          @if (activeTab() === 'lesson-prep') {
            <div class="max-w-4xl mx-auto space-y-8">
              <div class="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <div class="relative z-10">
                  <h3 class="text-2xl font-bold mb-2">AI Lesson Planner</h3>
                  <p class="text-indigo-200 mb-6">Generate comprehensive lesson plans, assessment questions, and teaching strategies in seconds.</p>
                  
                  <div class="flex gap-2">
                    <input 
                      type="text" 
                      [(ngModel)]="lessonTopic"
                      placeholder="Enter topic (e.g. Mitosis, French Revolution, Trigonometry)..."
                      class="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                    <button 
                      (click)="prepareLesson()"
                      [disabled]="!lessonTopic || isPreparingLesson()"
                      class="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <mat-icon>{{ isPreparingLesson() ? 'sync' : 'auto_awesome' }}</mat-icon>
                      {{ isPreparingLesson() ? 'Planning...' : 'Generate Plan' }}
                    </button>
                  </div>
                </div>
                <!-- Abstract background shape -->
                <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
              </div>

              @if (lessonPlan()) {
                <div class="bg-white p-8 rounded-3xl border border-stone-200 shadow-lg animate-fade-in whitespace-pre-wrap leading-relaxed text-stone-700">
                  {{ lessonPlan() }}
                </div>
              }
            </div>
          }

          <!-- Students Tab -->
          @if (activeTab() === 'students') {
            <div class="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <table class="w-full text-left">
                <thead class="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th class="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Student</th>
                    <th class="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Grade</th>
                    <th class="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Attendance</th>
                    <th class="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Last Activity</th>
                    <th class="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                  @for (student of students; track student.id) {
                    <tr class="hover:bg-stone-50 transition-all">
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-600 font-bold text-xs uppercase">
                            {{ student.name.charAt(0) }}
                          </div>
                          <span class="font-bold text-stone-900">{{ student.name }}</span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span [class]="student.gradeClass" class="px-2 py-1 rounded text-xs font-bold">{{ student.grade }}</span>
                      </td>
                      <td class="px-6 py-4 text-sm text-stone-600">{{ student.attendance }}%</td>
                      <td class="px-6 py-4 text-sm text-stone-500">{{ student.lastActivity }}</td>
                      <td class="px-6 py-4">
                        <button class="text-indigo-600 hover:text-indigo-800 font-bold text-sm">View Details</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          <!-- Create Test Tab -->
          @if (activeTab() === 'tests') {
            <div class="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
              <h3 class="text-xl font-bold mb-6">New Assessment</h3>
              <div class="space-y-6">
                <div>
                  <label for="test-title" class="block text-sm font-medium text-stone-700 mb-1">Test Title</label>
                  <input id="test-title" type="text" class="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="subject-select" class="block text-sm font-medium text-stone-700 mb-1">Subject</label>
                    <select id="subject-select" class="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                      <option>Mathematics</option>
                      <option>Science</option>
                      <option>History</option>
                    </select>
                  </div>
                  <div>
                    <label for="duration-input" class="block text-sm font-medium text-stone-700 mb-1">Duration (mins)</label>
                    <input id="duration-input" type="number" class="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  </div>
                </div>
                <button class="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  <mat-icon>add</mat-icon>
                  Create Assessment
                </button>
              </div>
            </div>
          }

        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeacherDashboard {
  auth = inject(AuthService);
  ai = inject(AiService);

  activeTab = signal<'overview' | 'students' | 'lesson-prep' | 'tests'>('overview');
  
  // Lesson Prep
  lessonTopic = '';
  lessonPlan = signal<string | null>(null);
  isPreparingLesson = signal(false);

  students = [
    { id: 1, name: 'Alice Johnson', grade: 'A', gradeClass: 'bg-emerald-100 text-emerald-700', attendance: 98, lastActivity: '2 hours ago' },
    { id: 2, name: 'Bob Smith', grade: 'B+', gradeClass: 'bg-blue-100 text-blue-700', attendance: 92, lastActivity: 'Yesterday' },
    { id: 3, name: 'Charlie Brown', grade: 'C', gradeClass: 'bg-orange-100 text-orange-700', attendance: 85, lastActivity: '3 days ago' },
    { id: 4, name: 'Diana Prince', grade: 'A+', gradeClass: 'bg-emerald-100 text-emerald-700', attendance: 100, lastActivity: '1 hour ago' },
  ];

  async prepareLesson() {
    if (!this.lessonTopic || this.isPreparingLesson()) return;

    this.isPreparingLesson.set(true);
    const plan = await this.ai.prepareLesson(this.lessonTopic);
    this.lessonPlan.set(plan);
    this.isPreparingLesson.set(false);
  }
}
