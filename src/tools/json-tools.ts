import { json, Tool } from "./types";

export const convertToJson: Tool<string, json> = {
  name: 'Parse JSON',
  description: 'Parse the given string into a JSON.',
  transform: (input: string) => { 
    return JSON.parse(input);
  },
  getHistoryDescription: function() {
    return 'Parsed string to JSON';
  },
  inputType: 'string',
  outputType: 'json',
}