import { truncate } from "./string-utils";
import { Tool } from "./types";

export const trim: Tool<string, string> = {
  name: 'Trim',
  description: 'Remove whitespace from both ends of the input.',
  transform: (input: string) => {
    return input.trim();
  },
  inputType: 'string',
  outputType: 'string',
  getHistoryDescription: function() {
    return 'Trimmed whitespace';
  },
}

export const stringify: Tool<any, string> = {
  name: 'Stringify',
  description: 'Converts the given input into a string.',
  transform: (input: any) => {
    if (Array.isArray(input)) {
      return '[\n  ' + input.join(',\n  ') + ',\n]';
    } else if (typeof input === 'object' && input !== undefined) {
      return JSON.stringify(input);
    }
    return input.toString();
  },
  inputType: 'any',
  outputType: 'string',
  getHistoryDescription: function() {
    return 'Converted to string';
  },
}

const replaceParameters = {
  findRegex: {
    name: 'Find expression',
    value: '',
    required: true,
    valueType: 'string',
    choiceType: 'freeResponse',
  },
  replaceRegex: {
    name: 'Replace expression',
    value: '',
    required: true,
    valueType: 'string',
    choiceType: 'freeResponse',
  }
} as const;

export const replace: Tool<string, string, typeof replaceParameters> = {
  name: 'Replace',
  description: 'Replaces the input into a string.',
  transform: function (input: string) {
    const { findRegex, replaceRegex } = this.params;
    const output = input.replaceAll(findRegex.value, replaceRegex.value);
    return output;
  },
  inputType: 'string',
  outputType: 'string',
  params: replaceParameters,
  getHistoryDescription: function() {
    return `Replace ${truncate(this.params.findRegex.value)} with ${truncate(this.params.findRegex.value)}`;
  },
}
