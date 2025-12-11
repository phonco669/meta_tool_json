export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export type JsonArray = JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  line?: number;
  column?: number;
}

export type ConversionMode = 'text-to-json' | 'json-to-text';

export interface AppState {
  textContent: string;
  jsonContent: string;
  mode: ConversionMode;
  error: ValidationResult | null;
}
