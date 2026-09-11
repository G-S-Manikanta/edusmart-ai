import { Injectable } from '@angular/core';

export interface PlaygroundContent {
  introduction: string;
  slides: string[];
  gameIdea: string;
  animations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  async chat(prompt: string, history: { role: string; parts: { text: string }[] }[] = []): Promise<string> {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, history }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      return data.text || "I'm sorry, I couldn't process that.";
    } catch (error) {
      console.error('AI Chat Error:', error);
      return "Error connecting to AI assistant. Please try again in a moment.";
    }
  }

  async generatePlaygroundContent(topic: string): Promise<PlaygroundContent | null> {
    try {
      const response = await fetch('/api/ai/playground', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: PlaygroundContent = await response.json();
      return data;
    } catch (error) {
      console.error('AI Playground Error:', error);
      return null;
    }
  }

  async prepareLesson(topic: string): Promise<string> {
    try {
      const response = await fetch('/api/ai/lesson-prep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      return data.text || 'Could not generate lesson plan.';
    } catch (error) {
      console.error('Lesson Prep Error:', error);
      return 'Error preparing lesson.';
    }
  }
}

