import { Tool } from "./types";

const stringToListParameters = {
  delimiter: {
    name: 'Delimiter',
    value: ',',
    required: true,
  },
}

const listToStringParameters = {
  delimiter: {
    name: 'Join',
    value: ',',
    required: true,
  },
}

export const stringToList: Tool<string, string[], typeof stringToListParameters> = {
  name: 'Split',
  description: 'Converts the input string into a list, given a delimiter.',
  transform: function (input: string): any[] {
    const unescapedDelimiter = this.params.delimiter.value.replaceAll('\\n', '\n');
    return input.split(unescapedDelimiter);
  },
  params: stringToListParameters,
  inputType: 'string',
  outputType: 'list',
  getHistoryDescription: function() {
    return `Split text to list using "${this.params.delimiter.value}"`;
  },
}

export const listToString: Tool<string[], string, typeof listToStringParameters> = {
  name: 'Join',
  description: 'Joins the input list into a string, given a delimiter.',
  transform: function (input: any[]): string {
    const unescapedDelimiter = this.params.delimiter.value.replaceAll('\\n', '\n');
    return input.join(unescapedDelimiter);
  },
  params: listToStringParameters,
  inputType: 'list',
  outputType: 'string',
  getHistoryDescription: function() {
    return `Joins the text to list using "${this.params.delimiter.value}"`;
  },
}