import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';
import {GoogleGenAI, Type} from '@google/genai';
import 'dotenv/config';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
app.set('trust proxy', true);

// Parse JSON request bodies for API routes
app.use(express.json());

const angularApp = new AngularNodeAppEngine({
  allowedHosts: ['*'],
  trustProxyHeaders: true,
});

// Lazy-initialize GoogleGenAI client with GEMINI_API_KEY
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env['GEMINI_API_KEY'];
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set.');
    }
    aiClient = new GoogleGenAI({apiKey});
  }
  return aiClient;
}

interface GenerateParams {
  contents: unknown;
  config?: Record<string, unknown>;
  model?: string;
}

async function generateContentWithRetry(params: GenerateParams) {
  const ai = getAi();
  const primaryModel = params.model || 'gemini-3.6-flash';
  const models = [primaryModel, 'gemini-3.6-flash', 'gemini-3.8-flash'];
  // Deduplicate in case primary is already one of the fallbacks
  const uniqueModels = Array.from(new Set(models));
  let lastError: unknown;

  for (const model of uniqueModels) {
    try {
      return await ai.models.generateContent({
        model,
        contents: params.contents as never,
        config: params.config as never,
      });
    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`Model ${model} failed: ${msg.slice(0, 100)}, trying next fallback...`);
    }
  }
  throw lastError;
}

/**
 * Server-side Gemini AI API Endpoints
 */
app.post('/api/ai/chat', async (req, res) => {
  try {
    const {prompt, history} = req.body;
    if (!prompt) {
      return res.status(400).json({error: 'Prompt is required'});
    }

    const contents: {role: string; parts: {text: string}[]}[] = [];

    if (Array.isArray(history)) {
      for (const item of history) {
        if (item && item.role && Array.isArray(item.parts)) {
          contents.push({
            role: item.role === 'model' ? 'model' : 'user',
            parts: item.parts.map((p: {text?: string}) => ({text: p?.text || ''})),
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{text: prompt}],
    });

    const response = await generateContentWithRetry({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction:
          'You are EduSmart AI, an encouraging, friendly, and intelligent teaching assistant. Help students solve doubts step-by-step, explain concepts clearly with intuitive analogies, and foster curiosity.',
      },
    });

    return res.json({text: response.text || "I'm sorry, I couldn't generate a response."});
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('API /api/ai/chat Error:', errorMsg);
    return res.status(500).json({
      error: 'Failed to generate chat response',
      details: errorMsg,
      text: "I'm having trouble connecting right now. Please try again in a moment.",
    });
  }
});

app.post('/api/ai/playground', async (req, res) => {
  try {
    const {topic} = req.body;
    if (!topic) {
      return res.status(400).json({error: 'Topic is required'});
    }

    const response = await generateContentWithRetry({
      model: 'gemini-3.6-flash',
      contents: `Generate a structured, interactive learning module for the topic: "${topic}".`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            introduction: {
              type: Type.STRING,
              description: 'An engaging, clear introduction explaining what this concept is and why it matters.',
            },
            slides: {
              type: Type.ARRAY,
              items: {type: Type.STRING},
              description: '3 key sequential learning points/slides.',
            },
            gameIdea: {
              type: Type.STRING,
              description: 'A fun, interactive game, thought experiment, or mini-challenge students can do.',
            },
            animations: {
              type: Type.ARRAY,
              items: {type: Type.STRING},
              description: '2 visual simulation descriptions showing the process step-by-step.',
            },
          },
          required: ['introduction', 'slides', 'gameIdea', 'animations'],
        },
      },
    });

    let rawText = (response.text || '{}').trim();
    if (rawText.startsWith('```json')) {
      rawText = rawText.slice(7);
    } else if (rawText.startsWith('```')) {
      rawText = rawText.slice(3);
    }
    if (rawText.endsWith('```')) {
      rawText = rawText.slice(0, -3);
    }
    rawText = rawText.trim();

    const parsed = JSON.parse(rawText);
    return res.json(parsed);
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('API /api/ai/playground Error:', errorMsg);
    return res.status(500).json({
      error: 'Failed to generate playground content',
      details: errorMsg,
      introduction: 'Unable to load lesson details at the moment.',
      slides: ['Please verify your internet connection and try again.'],
      gameIdea: 'Try asking our AI Assistant in the chat tab.',
      animations: ['Interactive visual simulation temporarily unavailable.'],
    });
  }
});

app.post('/api/ai/lesson-prep', async (req, res) => {
  try {
    const {topic} = req.body;
    if (!topic) {
      return res.status(400).json({error: 'Topic is required'});
    }

    const response = await generateContentWithRetry({
      model: 'gemini-3.6-flash',
      contents: `Act as a master educator and pedagogical specialist. Prepare a thorough, actionable lesson plan for teaching: "${topic}".
Include:
1. Learning Objectives (Measurable outcomes)
2. The Hook (Engaging introduction to spark student curiosity)
3. Step-by-Step Direct Instruction (How to explain the core concept with intuitive analogies)
4. Guided Practice & Interactive Classroom Activity
5. Common Misconceptions & How to Correct Them
6. Formative Assessment & Exit Ticket Questions`,
    });

    return res.json({text: response.text || 'Could not generate lesson plan.'});
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('API /api/ai/lesson-prep Error:', errorMsg);
    return res.status(500).json({
      error: 'Failed to prepare lesson plan',
      details: errorMsg,
      text: 'Error generating lesson plan. Please try again.',
    });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
