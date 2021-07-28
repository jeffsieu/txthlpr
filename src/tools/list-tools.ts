import { Tool } from "./types";

const stringToListParameters = {
  delimiter: {
    name: "Delimiter",
    value: ",",
    valueType: "string",
    required: true,
    choiceType: "freeResponse",
  },
} as const;

export const stringToList: Tool<
  string,
  string[],
  typeof stringToListParameters
> = {
  name: "Split",
  description: "Converts the input string into a list, given a delimiter.",
  transform: function (input: string): any[] {
    const unescapedDelimiter = this.params.delimiter.value.replaceAll(
      "\\n",
      "\n"
    );
    return input.split(unescapedDelimiter);
  },
  params: stringToListParameters,
  inputType: "string",
  outputType: "list",
  getHistoryDescription: function () {
    return `Split text to list using "${this.params.delimiter.value}"`;
  },
};

const listToStringParameters = {
  delimiter: {
    name: "Join",
    value: ",",
    valueType: "string",
    required: true,
    choiceType: "freeResponse",
  },
} as const;

export const listToString: Tool<
  string[],
  string,
  typeof listToStringParameters
> = {
  name: "Join",
  description: "Joins the input list into a string, given a delimiter.",
  transform: function (input: string[]): string {
    const unescapedDelimiter = this.params.delimiter.value.replaceAll(
      "\\n",
      "\n"
    );
    return input.join(unescapedDelimiter);
  },
  params: listToStringParameters,
  inputType: "list",
  outputType: "string",
  getHistoryDescription: function () {
    return `Joined text using "${this.params.delimiter.value}"`;
  },
};

const filterConditionChoices = ["Remove empty"];

const filterParameters = {
  filterCondition: {
    name: "Filter condition",
    value: "Remove empty" as typeof filterConditionChoices[number],
    required: true,
    choiceType: "multipleChoice",
    choices: filterConditionChoices,
  },
} as const;

export const listFilter: Tool<string[], string[], typeof filterParameters> = {
  name: "Filter",
  description: "Filters the list using a given condition.",
  transform: function (input: string[]): string[] {
    switch (this.params.filterCondition.value) {
      case "Remove empty": {
        return input.filter((value) => value !== "");
      }
    }
    return [...input];
  },
  params: filterParameters,
  inputType: "list",
  outputType: "list",
  getHistoryDescription: function () {
    return `Filtered the list using ${this.params.filterCondition.value}`;
  },
};
