import yaml from 'js-yaml';
import { JsonValue } from '../types';

export function formatJsonToText(json: JsonValue): string {
  try {
    return yaml.dump(json, {
      indent: 2,
      lineWidth: -1, // 禁止自动换行
      noRefs: true, // 禁用锚点引用
      quotingType: '"', // 字符串使用双引号（如果需要）
    });
  } catch (e) {
    console.error('Format error:', e);
    return '';
  }
}
