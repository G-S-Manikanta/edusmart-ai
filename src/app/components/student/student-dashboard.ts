import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AiService, PlaygroundContent } from '../../services/ai.service';
import { MatIconModule } from '@angular/material/icon';

interface Message {
  role: 'user' | 'model';
  text: string;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-stone-50 flex font-sans">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-stone-200 flex flex-col">
        <div class="p-6 flex items-center gap-3">
          <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
            <mat-icon>school</mat-icon>
          </div>
          <span class="font-bold text-stone-900">EduSmart</span>
        </div>

        <nav class="flex-1 px-4 space-y-2">
          <button 
            (click)="activeTab.set('dashboard')"
            [class.bg-stone-100]="activeTab() === 'dashboard'"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-all"
          >
            <mat-icon [class.text-emerald-600]="activeTab() === 'dashboard'">dashboard</mat-icon>
            <span class="font-medium">Dashboard</span>
          </button>
          <button 
            (click)="activeTab.set('playground')"
            [class.bg-stone-100]="activeTab() === 'playground'"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-all"
          >
            <mat-icon [class.text-emerald-600]="activeTab() === 'playground'">rocket_launch</mat-icon>
            <span class="font-medium">AI Playground</span>
          </button>
          <button 
            (click)="activeTab.set('tests')"
            [class.bg-stone-100]="activeTab() === 'tests'"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-all"
          >
            <mat-icon [class.text-emerald-600]="activeTab() === 'tests'">quiz</mat-icon>
            <span class="font-medium">Tests & Practice</span>
          </button>
          <button 
            (click)="activeTab.set('chat')"
            [class.bg-stone-100]="activeTab() === 'chat'"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-all"
          >
            <mat-icon [class.text-emerald-600]="activeTab() === 'chat'">smart_toy</mat-icon>
            <span class="font-medium">AI Assistant</span>
          </button>
        </nav>

        <div class="p-4 border-t border-stone-100">
          <div class="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
            <div class="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center text-stone-600 font-bold text-xs">
              {{ auth.currentUser()?.name?.charAt(0)?.toUpperCase() }}
            </div>
            <div class="flex-1 overflow-hidden">
              <p class="text-xs font-bold text-stone-900 truncate">{{ auth.currentUser()?.name }}</p>
              <p class="text-[10px] text-stone-500 truncate">{{ auth.currentUser()?.email }}</p>
            </div>
            <button (click)="auth.logout()" class="text-stone-400 hover:text-red-500">
              <mat-icon class="text-sm">logout</mat-icon>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="h-16 bg-white border-b border-stone-200 px-8 flex items-center justify-between">
          <h2 class="text-lg font-bold text-stone-900 capitalize">{{ activeTab() }}</h2>
          <div class="flex items-center gap-4">
            <div class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
              Level 12 • 2450 XP
            </div>
          </div>
        </header>

        <!-- Content Area -->
        <div class="flex-1 overflow-y-auto p-8">
          
          <!-- Dashboard Tab -->
          @if (activeTab() === 'dashboard') {
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              <div class="md:col-span-2 space-y-6">
                <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <h3 class="text-lg font-bold mb-4">Welcome back, {{ auth.currentUser()?.name }}!</h3>
                  <p class="text-stone-500 mb-6">You have 2 tests pending this week. Your AI Assistant is ready to help you with your doubts.</p>
                  <div class="grid grid-cols-3 gap-4">
                    <div class="p-4 bg-stone-50 rounded-xl border border-stone-100">
                      <p class="text-xs text-stone-400 uppercase font-bold tracking-wider mb-1">Attendance</p>
                      <p class="text-2xl font-bold text-stone-900">94%</p>
                    </div>
                    <div class="p-4 bg-stone-50 rounded-xl border border-stone-100">
                      <p class="text-xs text-stone-400 uppercase font-bold tracking-wider mb-1">Avg Score</p>
                      <p class="text-2xl font-bold text-stone-900">88%</p>
                    </div>
                    <div class="p-4 bg-stone-50 rounded-xl border border-stone-100">
                      <p class="text-xs text-stone-400 uppercase font-bold tracking-wider mb-1">Completed</p>
                      <p class="text-2xl font-bold text-stone-900">12/15</p>
                    </div>
                  </div>
                </div>

                <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <h3 class="text-lg font-bold mb-4">Recent Activity</h3>
                  <div class="space-y-4">
                    <div class="flex items-center gap-4 p-3 hover:bg-stone-50 rounded-xl transition-all cursor-pointer">
                      <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                        <mat-icon>science</mat-icon>
                      </div>
                      <div class="flex-1">
                        <p class="font-bold text-stone-900">Photosynthesis Quiz</p>
                        <p class="text-xs text-stone-500">Completed yesterday • Score: 90%</p>
                      </div>
                      <mat-icon class="text-stone-300">chevron_right</mat-icon>
                    </div>
                    <div class="flex items-center gap-4 p-3 hover:bg-stone-50 rounded-xl transition-all cursor-pointer">
                      <div class="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                        <mat-icon>functions</mat-icon>
                      </div>
                      <div class="flex-1">
                        <p class="font-bold text-stone-900">Algebra Practice</p>
                        <p class="text-xs text-stone-500">2 days ago • 45 mins spent</p>
                      </div>
                      <mat-icon class="text-stone-300">chevron_right</mat-icon>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                <div class="bg-stone-900 text-white p-6 rounded-2xl shadow-xl">
                  <h3 class="text-lg font-bold mb-2">AI Tip of the Day</h3>
                  <p class="text-stone-400 text-sm mb-4">"Try breaking down complex problems into smaller, manageable steps. Use the AI Chat if you get stuck!"</p>
                  <button (click)="activeTab.set('chat')" class="w-full bg-emerald-600 py-2 rounded-lg font-bold text-sm hover:bg-emerald-500 transition-all">Ask AI Now</button>
                </div>

                <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <h3 class="text-lg font-bold mb-4">Upcoming Tests</h3>
                  <div class="space-y-3">
                    <div class="p-3 border border-stone-100 rounded-xl bg-stone-50">
                      <p class="font-bold text-sm">World History</p>
                      <p class="text-xs text-stone-500">Tomorrow, 10:00 AM</p>
                    </div>
                    <div class="p-3 border border-stone-100 rounded-xl">
                      <p class="font-bold text-sm">Advanced Physics</p>
                      <p class="text-xs text-stone-500">Friday, 02:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- AI Playground Tab -->
          @if (activeTab() === 'playground') {
            <div class="max-w-4xl mx-auto space-y-8">
              <div class="text-center">
                <h3 class="text-3xl font-bold text-stone-900 mb-2">AI Learning Playground</h3>
                <p class="text-stone-500">Enter a topic and let AI create an interactive lesson for you.</p>
              </div>

              <div class="flex gap-2">
                <input 
                  type="text" 
                  [(ngModel)]="playgroundTopic"
                  placeholder="e.g. How black holes work, The Water Cycle, Quantum Physics..."
                  class="flex-1 px-6 py-4 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm"
                >
                <button 
                  (click)="generatePlayground()"
                  [disabled]="!playgroundTopic || isGeneratingPlayground()"
                  class="px-8 py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <mat-icon>{{ isGeneratingPlayground() ? 'sync' : 'magic_button' }}</mat-icon>
                  {{ isGeneratingPlayground() ? 'Generating...' : 'Create Lesson' }}
                </button>
              </div>

              @if (playgroundContent(); as content) {
                <div class="space-y-8 animate-fade-in">
                  <div class="bg-white p-8 rounded-3xl border border-stone-200 shadow-lg">
                    <h4 class="text-2xl font-bold mb-4 text-emerald-700">{{ content.introduction }}</h4>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                      @for (slide of content.slides; track $index) {
                        <div class="p-6 bg-stone-50 rounded-2xl border border-stone-100 hover:shadow-md transition-all">
                          <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-stone-400 mb-3">{{ $index + 1 }}</div>
                          <p class="text-stone-700 leading-relaxed">{{ slide }}</p>
                        </div>
                      }
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-blue-600 text-white p-8 rounded-3xl shadow-xl">
                      <div class="flex items-center gap-3 mb-4">
                        <mat-icon>videogame_asset</mat-icon>
                        <h4 class="text-xl font-bold">Game Idea</h4>
                      </div>
                      <p class="text-blue-100 leading-relaxed">{{ content.gameIdea }}</p>
                    </div>
                    <div class="bg-stone-900 text-white p-8 rounded-3xl shadow-xl">
                      <div class="flex items-center gap-3 mb-4">
                        <mat-icon>animation</mat-icon>
                        <h4 class="text-xl font-bold">AI Visualizations</h4>
                      </div>
                      <ul class="space-y-4">
                        @for (anim of content.animations; track $index) {
                          <li class="flex gap-3">
                            <span class="text-emerald-500 font-bold">•</span>
                            <span class="text-stone-400 text-sm">{{ anim }}</span>
                          </li>
                        }
                      </ul>
                    </div>
                  </div>
                </div>
              }
            </div>
          }

          <!-- AI Assistant Tab -->
          @if (activeTab() === 'chat') {
            <div class="max-w-3xl mx-auto h-[calc(100vh-200px)] flex flex-col bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
              <div class="p-4 bg-stone-50 border-b border-stone-200 flex items-center gap-3">
                <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                  <mat-icon class="text-sm">smart_toy</mat-icon>
                </div>
                <div>
                  <p class="text-sm font-bold">EduSmart AI Assistant</p>
                  <p class="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Online</p>
                </div>
              </div>

              <div class="flex-1 overflow-y-auto p-6 space-y-4" id="chat-container">
                @for (msg of chatMessages(); track $index) {
                  <div [class.justify-end]="msg.role === 'user'" class="flex">
                    <div 
                      [class.bg-emerald-600]="msg.role === 'user'"
                      [class.text-white]="msg.role === 'user'"
                      [class.bg-stone-100]="msg.role === 'model'"
                      [class.text-stone-800]="msg.role === 'model'"
                      class="max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm"
                    >
                      {{ msg.text }}
                    </div>
                  </div>
                }
                @if (isTyping()) {
                  <div class="flex">
                    <div class="bg-stone-100 p-4 rounded-2xl flex gap-1">
                      <div class="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"></div>
                      <div class="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div class="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                }
              </div>

              <div class="p-4 border-t border-stone-100">
                <div class="flex gap-2">
                  <input 
                    type="text" 
                    [(ngModel)]="chatInput"
                    (keyup.enter)="sendMessage()"
                    placeholder="Ask me anything..."
                    class="flex-1 px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                  <button 
                    (click)="sendMessage()"
                    [disabled]="!chatInput || isTyping()"
                    class="w-12 h-12 bg-stone-900 text-white rounded-xl flex items-center justify-center hover:bg-stone-800 transition-all disabled:opacity-50"
                  >
                    <mat-icon>send</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          }

          <!-- Tests Tab -->
          @if (activeTab() === 'tests') {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all">
                <div class="flex justify-between items-start mb-4">
                  <div class="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                    <mat-icon>history_edu</mat-icon>
                  </div>
                  <span class="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded uppercase">Due Today</span>
                </div>
                <h4 class="font-bold text-lg mb-1">World History: Industrial Revolution</h4>
                <p class="text-stone-500 text-sm mb-4">20 Questions • 45 Minutes</p>
                <button class="w-full bg-stone-900 text-white py-2 rounded-lg font-bold hover:bg-stone-800 transition-all">Start Test</button>
              </div>

              <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all">
                <div class="flex justify-between items-start mb-4">
                  <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <mat-icon>calculate</mat-icon>
                  </div>
                  <span class="px-2 py-1 bg-stone-100 text-stone-500 text-[10px] font-bold rounded uppercase">Practice</span>
                </div>
                <h4 class="font-bold text-lg mb-1">Calculus: Derivatives</h4>
                <p class="text-stone-500 text-sm mb-4">Infinite Practice Mode</p>
                <button class="w-full border border-stone-200 text-stone-900 py-2 rounded-lg font-bold hover:bg-stone-50 transition-all">Practice Now</button>
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
export class StudentDashboard {
  auth = inject(AuthService);
  ai = inject(AiService);

  activeTab = signal<'dashboard' | 'playground' | 'tests' | 'chat'>('dashboard');
  
  // Chat
  chatInput = '';
  chatMessages = signal<Message[]>([
    { role: 'model', text: 'Hi! I am your EduSmart AI Assistant. How can I help you learn today?' }
  ]);
  isTyping = signal(false);

  // Playground
  playgroundTopic = '';
  playgroundContent = signal<PlaygroundContent | null>(null);
  isGeneratingPlayground = signal(false);

  async sendMessage() {
    if (!this.chatInput || this.isTyping()) return;

    const userMsg = this.chatInput;
    this.chatInput = '';
    this.chatMessages.update(msgs => [...msgs, { role: 'user', text: userMsg }]);
    this.isTyping.set(true);

    const history = this.chatMessages().map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await this.ai.chat(userMsg, history);
    this.chatMessages.update(msgs => [...msgs, { role: 'model', text: response }]);
    this.isTyping.set(false);
    
    setTimeout(() => {
      const container = document.getElementById('chat-container');
      if (container) container.scrollTop = container.scrollHeight;
    }, 100);
  }

  async generatePlayground() {
    if (!this.playgroundTopic || this.isGeneratingPlayground()) return;

    this.isGeneratingPlayground.set(true);
    const content = await this.ai.generatePlaygroundContent(this.playgroundTopic);
    if (content) {
      this.playgroundContent.set(content);
    }
    this.isGeneratingPlayground.set(false);
  }
}
