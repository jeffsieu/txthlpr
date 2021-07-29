import { truncate } from "./string-utils";
import { Tool } from "./types";

export const trim: Tool<string, string> = {
  name: "Trim",
  description: "Remove whitespace from both ends of the input.",
  transform: (input: string) => {
    return input.trim();
  },
  inputType: "string",
  outputType: "string",
  getHistoryDescription: function () {
    return "Trimmed whitespace";
  },
};

export const stringify: Tool<any, string> = {
  name: "Stringify",
  description: "Converts the given input into a string.",
  transform: (input: any) => {
    if (Array.isArray(input)) {
      return "[\n  " + input.join(",\n  ") + ",\n]";
    } else if (typeof input === "object" && input !== undefined) {
      return JSON.stringify(input);
    }
    return input.toString();
  },
  inputType: "any",
  outputType: "string",
  getHistoryDescription: function () {
    return "Converted to string";
  },
};

const replaceModeParamChoices = [
  "First occurrence",
  "Last occurrence",
  "All occurrences",
] as const;

const includeParamChoices = [
  "Nothing else",
  "Everything after",
  "Everything before",
] as const;

const replaceParameters = {
  findRegex: {
    name: "Find expression",
    value: "",
    required: true,
    valueType: "string",
    choiceType: "freeResponse",
  },
  replaceMode: {
    name: "Replace mode",
    value: "All occurrences" as typeof replaceModeParamChoices[number],
    required: true,
    valueType: "string",
    choiceType: "multipleChoice",
    choices: replaceModeParamChoices,
  },
  includeMode: {
    name: "Include",
    value: "Nothing else" as typeof includeParamChoices[number],
    required: true,
    valueType: "string",
    choiceType: "multipleChoice",
    choices: includeParamChoices,
  },
  replaceRegex: {
    name: "Replace expression",
    value: "",
    required: true,
    valueType: "string",
    choiceType: "freeResponse",
  },
} as const;

const replaceStringAtIndex = (str: string, replaceValue: string, index: number, findValueLength: number, includeMode: typeof includeParamChoices[number]): string => {
  if (index === -1) {
    return str;
  } else {
    const beforeSubstring = str.substring(0, index);
    const afterSubstring = str.substring(index + findValueLength, str.length);
    switch (includeMode) {
      case "Nothing else":
        return beforeSubstring + replaceValue + afterSubstring;
      case "Everything before":
        return replaceValue + afterSubstring;
      case "Everything after":
        return beforeSubstring + replaceValue;
    }
    console.log("gay!");
  }
}

export const replace: Tool<string, string, typeof replaceParameters> = {
  name: "Replace",
  description: "Replaces the input into a string.",
  transform: function (input: string) {
    const { findRegex, replaceRegex, replaceMode, includeMode } = this.params;
    switch (replaceMode.value) {
      case "All occurrences":
        let previousOutput = input;
        let output: string | undefined = undefined;
        let startPosition = 0;
        do {
          console.log("yo!!!")
          console.log(previousOutput);
          console.log(output);
          console.log(startPosition);
          if (output !== undefined)
            previousOutput = output;
          const index = previousOutput.indexOf(findRegex.value, startPosition);
          if (index !== -1) {
            // new start position after string gets replaced
            startPosition = index + replaceRegex.value.length;
          } else {
            return previousOutput;
          }
          output = replaceStringAtIndex(previousOutput, replaceRegex.value, index, findRegex.value.length, includeMode.value);
        } while (output !== previousOutput);
        return output;
      case "First occurrence":
      case "Last occurrence":
        const index = replaceMode.value === "First occurrence" ? input.indexOf(findRegex.value) : input.lastIndexOf(findRegex.value);
        return replaceStringAtIndex(input, replaceRegex.value, index, findRegex.value.length, includeMode.value);
    }
  },
  inputType: "string",
  outputType: "string",
  params: replaceParameters,
  getHistoryDescription: function () {
    return `Replace ${truncate(this.params.findRegex.value)} with ${truncate(
      this.params.findRegex.value
    )}`;
  },
};
