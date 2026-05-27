import { readFileSync } from 'fs';
import { join } from 'path';

const PROMPTS_DIR = join(process.cwd(), 'ai', 'prompts');

function loadPrompt(relativePath: string): string {
  return readFileSync(join(PROMPTS_DIR, relativePath), 'utf-8');
}

export interface CopywriterInput {
  /** The UI context (page name, component type) */
  context: string;
  /** The copy to write or improve */
  subject: string;
  /** Tone of voice: formal, casual, playful, urgent */
  tone?: 'formal' | 'casual' | 'playful' | 'urgent';
  /** Target language */
  language?: 'es' | 'en';
}

const COPYWRITER_SYSTEM = `
You are a conversion-focused copywriter for FoleyPlay, a premium streaming platform.

## Voice
- Warm, direct, confident. Never corporate, never stiff.
- Spanish (Rioplatense): use voseo naturally. "Explorá el catálogo", not "Explore el catálogo".
- Short sentences. Max 12 words per sentence in UI copy.
- Action verbs for CTAs. Benefits, not features.

## Rules
- Headlines: under 8 words. No period at end.
- Descriptions: 1–2 sentences max. One idea per sentence.
- CTAs: verb + outcome. "Empezar gratis", "Ver ahora", "Explorar catálogo".
- Error messages: what went wrong + what to do next.
- Empty states: friendly + actionable. Never "No hay datos".
- Buttons: never "Enviar", "Aceptar", "OK". Always specific.

## Hierarchy of Words
1. Benefit over feature ("Ver sin cortes" not "Sin publicidad")
2. Active over passive ("Descargá tu favorita" not "Las descargas están disponibles")
3. Specific over general ("200+ títulos nuevos este mes" not "Mucho contenido nuevo")
`;

/**
 * Copywriter agent — produces UI copy that converts.
 */
export function buildCopywriterPrompt(input: CopywriterInput): string {
  const conversionRules = loadPrompt('conversion-rules.md');
  const tone = input.tone ?? 'casual';
  const language = input.language ?? 'es';

  return [
    COPYWRITER_SYSTEM,
    '---',
    `# Conversion Rules\n${conversionRules}`,
    '---',
    `# Task`,
    `Context: ${input.context}`,
    `Tone: ${tone}`,
    `Language: ${language === 'es' ? 'Spanish (Rioplatense)' : 'English'}`,
    '',
    '## Copy to Write/Improve',
    input.subject,
  ].join('\n\n');
}
