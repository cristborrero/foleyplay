import { readFileSync } from 'fs';
import { join } from 'path';

const PROMPTS_DIR = join(process.cwd(), 'ai', 'prompts');

function loadPrompt(relativePath: string): string {
  return readFileSync(join(PROMPTS_DIR, relativePath), 'utf-8');
}

export interface CriticInput {
  /** The design or implementation to evaluate */
  subject: string;
  /** Optional: which rules to evaluate against */
  rules?: Array<'ui' | 'ux' | 'motion' | 'spacing' | 'typography' | 'color' | 'conversion'>;
}

export interface CriticScore {
  visualHierarchy: number;
  consistency: number;
  motion: number;
  accessibility: number;
  conversion: number;
  total: number;
  verdict: 'APPROVED' | 'NEEDS WORK' | 'REJECTED';
}

/**
 * Critic agent — evaluates designs against FoleyPlay design system standards.
 * Returns a structured scoring prompt.
 */
export function buildCriticPrompt(input: CriticInput): string {
  const criticPrompt = loadPrompt('critic.md');
  const system = loadPrompt('system.md');

  const rulesToLoad = input.rules ?? ['ui', 'ux', 'motion', 'spacing', 'typography', 'color', 'conversion'];
  const ruleFileMap: Record<string, string> = {
    ui: 'ui-rules.md',
    ux: 'ux-rules.md',
    motion: 'motion-rules.md',
    spacing: 'spacing-rules.md',
    typography: 'typography-rules.md',
    color: 'color-rules.md',
    conversion: 'conversion-rules.md',
  };

  const rulesContent = rulesToLoad
    .map(rule => loadPrompt(ruleFileMap[rule]))
    .join('\n\n---\n\n');

  return [
    system,
    '---',
    criticPrompt,
    '---',
    '# Design Standards to Evaluate Against',
    rulesContent,
    '---',
    '# Subject to Evaluate',
    input.subject,
  ].join('\n\n');
}

/**
 * Parse a critic response into a structured score object.
 * Expects the format defined in critic.md.
 */
export function parseCriticScore(response: string): Partial<CriticScore> {
  const scoreMatch = response.match(/SCORE:\s*(\d+)\/50/);
  const verdictMatch = response.match(/VERDICT:\s*(APPROVED|NEEDS WORK|REJECTED)/);

  return {
    total: scoreMatch ? parseInt(scoreMatch[1]) : undefined,
    verdict: verdictMatch ? (verdictMatch[1] as CriticScore['verdict']) : undefined,
  };
}
