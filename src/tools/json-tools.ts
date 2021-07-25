import { json, Tool } from "./types";

export const convertToJson: Tool<string, json> = {
  name: 'Convert to JSON',
  description: 'Parse the current text into a JSON.',
  transform: (input: string) => { 
    return JSON.parse(input);
  },
  getHistoryDescription: function() {
    return 'nice';
  },
  inputType: 'string',
  outputType: 'json/any',
}