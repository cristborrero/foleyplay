import { readFileSync } from 'fs';
import { join } from 'path';

const PROMPTS_DIR = join(process.cwd(), 'ai', 'prompts');

function loadPrompt(relativePath: string): string {
  return readFileSync(join(PROMPTS_DIR, relativePath), 'utf-8');
}

export interface DesignerInput {
  task: string;
  context?: string;
  references?: string[];
}

export interface DesignerOutput {
  agent: 'designer';
  design: string;
  rationale: string;
  code?: string;
}

/**
 * Designer agent — produces UI designs and component implementations.
 *
 * Combines the system prompt, UI/UX rules, motion rules, spacing rules,
 * typography rules, and color rules into a single context, then applies
 * the task-specific prompt.
 */
export function buildDesignerPrompt(input: DesignerInput): string {
  const system = loadPrompt('system.md');
  const uiRules = loadPrompt('ui-rules.md');
  const uxRules = loadPrompt('ux-rules.md');
  const motionRules = loadPrompt('motion-rules.md');
  const spacingRules = loadPrompt('spacing-rules.md');
  const typographyRules = loadPrompt('typography-rules.md');
  const colorRules = loadPrompt('color-rules.md');

  const referenceContent = (input.references ?? [])
    .map(ref => `## Reference: ${ref}\n${loadPrompt(`references/${ref}.md`)}`)
    .join('\n\n---\n\n');

  return [
    system,
    '---',
    uiRules,
    '---',
    uxRules,
    '---',
    motionRules,
    '---',
    spacingRules,
    '---',
    typographyRules,
    '---',
    colorRules,
    referenceContent ? '---\n# Reference Material\n' + referenceContent : '',
    '---',
    '# Task',
    input.task,
    input.context ? `\n## Additional Context\n${input.context}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
}
