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
    return 'nice';
  },
}

export const stringify: Tool<any, string> = {
  name: 'Stringify',
  description: 'Converts the input into a string.',
  transform: (input: any) => {
    if (Array.isArray(input)) {
      return input.join('\n');
    }
    return input.toString();
  },
  inputType: 'json/any',
  outputType: 'string',
  getHistoryDescription: function() {
    return 'nice';
  },
}

const ReplaceParameters = {
  findRegex: {
    name: 'Find expression',
    value: '',
    required: true,
  },
  replaceRegex: 
  {
    name: 'Replace expression',
    value: '',
    required: true,
  },
};

export const replace: Tool<string, string, typeof ReplaceParameters> = {
  name: 'Replace',
  description: 'Replaces the input into a string.',
  transform: function (input: string) {
    const { findRegex, replaceRegex } = this.params;
    const output = input.replaceAll(findRegex.value, replaceRegex.value);
    console.log(`${input} ${output}`);
    return output;
  },
  inputType: 'string',
  outputType: 'string',
  params: ReplaceParameters,
  getHistoryDescription: function() {
    return `Replace ${truncate(this.params.findRegex.value)} with ${truncate(this.params.findRegex.value)}`;
  },
}
