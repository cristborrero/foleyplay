import { buildDesignerPrompt } from './agents/designer';
import { buildCriticPrompt, parseCriticScore } from './agents/critic';
import { buildCopywriterPrompt } from './agents/copywriter';
import { buildFrontendPrompt } from './agents/frontend';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// ─── Types ───────────────────────────────────────────────────────────────────

export type TaskName =
  | 'landing-page'
  | 'dashboard'
  | 'settings-page'
  | 'onboarding'
  | 'auth-ui'
  | 'pricing-page'
  | 'analytics-ui'
  | 'mobile-ui'
  | 'redesign'
  | 'component-design';

export type ReferenceSource = 'stripe' | 'linear' | 'vercel' | 'notion' | 'framer' | 'apple';

export interface PipelineOptions {
  task: TaskName;
  context?: string;
  references?: ReferenceSource[];
  /** If true, runs critic after designer and requires approval before frontend */
  withCritic?: boolean;
  /** If true, generates copy alongside the design */
  withCopy?: boolean;
}

export interface PipelineResult {
  designerPrompt: string;
  criticPrompt?: string;
  copywriterPrompt?: string;
  frontendPrompt: string;
  taskContent: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadTaskPrompt(task: TaskName): string {
  const taskPath = join(process.cwd(), 'ai', 'prompts', 'tasks', `${task}.md`);
  if (!existsSync(taskPath)) throw new Error(`Task prompt not found: ${task}`);
  return readFileSync(taskPath, 'utf-8');
}

// ─── Pipeline ────────────────────────────────────────────────────────────────

/**
 * Main pipeline — orchestrates designer → critic → copywriter → frontend.
 *
 * Usage:
 * ```ts
 * const prompts = buildPipeline({
 *   task: 'landing-page',
 *   references: ['stripe', 'framer'],
 *   withCritic: true,
 *   withCopy: true,
 * });
 * // Pass prompts.designerPrompt to your LLM client
 * ```
 */
export function buildPipeline(options: PipelineOptions): PipelineResult {
  const taskContent = loadTaskPrompt(options.task);

  // 1. Designer — creates the UI design / implementation
  const designerPrompt = buildDesignerPrompt({
    task: taskContent,
    context: options.context,
    references: options.references,
  });

  // 2. Critic — evaluates the designer's output (optional)
  const criticPrompt = options.withCritic
    ? buildCriticPrompt({
        subject: `Task: ${options.task}\n\n${taskContent}\n\n${options.context ?? ''}`,
      })
    : undefined;

  // 3. Copywriter — generates UI copy (optional)
  const copywriterPrompt = options.withCopy
    ? buildCopywriterPrompt({
        context: options.task,
        subject: taskContent,
        tone: 'casual',
        language: 'es',
      })
    : undefined;

  // 4. Frontend — implements the design in code
  const frontendPrompt = buildFrontendPrompt({
    task: `Implement the following UI design for task: ${options.task}\n\n${taskContent}`,
    performanceCritical: options.task === 'landing-page' || options.task === 'dashboard',
  });

  return {
    designerPrompt,
    criticPrompt,
    copywriterPrompt,
    frontendPrompt,
    taskContent,
  };
}

/**
 * Shorthand: get just the designer prompt for a given task.
 */
export function designTask(task: TaskName, context?: string): string {
  return buildDesignerPrompt({ task: loadTaskPrompt(task), context });
}

/**
 * Shorthand: get the full pipeline prompt as a single string.
 * Useful for single-shot LLM calls.
 */
export function fullPipeline(options: PipelineOptions): string {
  const result = buildPipeline(options);
  return [
    '# STEP 1 — DESIGNER',
    result.designerPrompt,
    result.criticPrompt ? '\n---\n# STEP 2 — CRITIC\n' + result.criticPrompt : '',
    result.copywriterPrompt ? '\n---\n# STEP 3 — COPYWRITER\n' + result.copywriterPrompt : '',
    '\n---\n# STEP 4 — FRONTEND ENGINEER',
    result.frontendPrompt,
  ]
    .filter(Boolean)
    .join('\n\n');
}
