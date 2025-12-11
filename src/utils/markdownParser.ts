import yaml from 'js-yaml';
import { JsonValue, ValidationResult } from '../types';

/**
 * Parses Markdown-like text (using bullets for lists) to JSON
 */
export function parseMarkdownToJson(text: string): { data: JsonValue | null; error: ValidationResult | null } {
  if (!text.trim()) {
    return { data: {}, error: null };
  }

  try {
    // Preprocess Markdown to YAML
    // 1. Convert bullet points (* or +) to YAML dashes (-)
    // We capture the indentation and replace the bullet with a dash
    const yamlText = text
      .split('\n')
      .map(line => {
        // Replace "* " or "+ " with "- " at the start of the line (respecting indentation)
        return line.replace(/^(\s*)[*+]\s/, '$1- ');
      })
      .map(line => {
        // Replace headings "# Key" with "Key:"
        return line.replace(/^(\s*)#+\s+(.*)$/, '$1$2:');
      })
      .map(line => {
        // Optional: Remove bold markers from keys if present (e.g. "**Key**:" -> "Key:")
        return line.replace(/^(\s*)\*\*(.+?)\*\*:/, '$1$2:');
      })
      .join('\n');

    const data = yaml.load(yamlText) as JsonValue;
    return { data, error: null };
  } catch (e: any) {
    return {
      data: null,
      error: {
        isValid: false,
        message: e.reason || e.message,
        line: e.mark?.line ? e.mark.line + 1 : undefined,
        column: e.mark?.column ? e.mark.column + 1 : undefined,
      }
    };
  }
}

/**
 * Formats JSON to Markdown-like text
 */
export function formatJsonToMarkdown(json: JsonValue): string {
  try {
    // First dump to YAML
    const yamlText = yaml.dump(json, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      quotingType: '"',
    });

    // Postprocess YAML to Markdown
    return yamlText
      .split('\n')
      .map(line => {
        // Convert YAML dashes (-) to bullet points (*)
        let newLine = line.replace(/^(\s*)-\s/, '$1* ');
        
        // Optional: Make keys bold (e.g. "Key:" -> "**Key**:")
        // This is purely aesthetic for Markdown
        newLine = newLine.replace(/^(\s*)([^:\s]+):/, '$1**$2**:');
        
        return newLine;
      })
      .join('\n');
  } catch (e) {
    console.error('Format error:', e);
    return '';
  }
}
