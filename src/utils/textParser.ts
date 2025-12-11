import yaml from 'js-yaml';
import { JsonValue, ValidationResult } from '../types';

export function parseTextToJson(text: string): { data: JsonValue | null; error: ValidationResult | null } {
  if (!text.trim()) {
    return { data: {}, error: null };
  }

  try {
    // 预处理：有些用户可能不喜欢加冒号，我们可以尝试智能添加（但这很危险）
    // 目前保持原样，要求用户输入合法的 YAML（即 key: value 或 key:\n  nested）
    // 大多数“层级文本”本质上就是 YAML 的子集
    
    const data = yaml.load(text) as JsonValue;
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
