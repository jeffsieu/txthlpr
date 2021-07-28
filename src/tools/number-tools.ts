import { Tool } from "./types";

export const stringToNumber: Tool<string, number> = {
  name: 'Parse number',
  description: 'Parse the given string into a number.',
  transform: (input: string) => { 
    return Number(input);
  },
  getHistoryDescription: function() {
    return 'Parsed string to number';
  },
  inputType: 'string',
  outputType: 'number',
}

const operationChoices = [
  'Add',
  'Subtract',
  'Multiply',
  'Divide',
] as const;

const manipulateNumberParams = {
  operation: {
    name: 'Operation',
    value: 'Add' as typeof operationChoices[number],
    valueType: 'string',
    choiceType: 'multipleChoice',
    choices: operationChoices,
    required: true,
  },
  operand: {
    name: 'Operand',
    value: 0,
    valueType: 'number',
    choiceType: 'freeResponse',
    required: true,
  },
} as const;

export const manipulateNumber: Tool<number, number, typeof manipulateNumberParams> = {
  name: 'Arithmetic',
  description: 'Perform arithmetic operations on the given number.',
  transform: function (input: number) {
    switch (this.params.operation.value) {
      case 'Add':
        return input + this.params.operand.value;
      case 'Subtract':
        return input - this.params.operand.value;
      case 'Multiply':
        return input * this.params.operand.value;
      case 'Divide':
        return input / this.params.operand.value;
    }
  },
  getHistoryDescription: function() {
    return 'Parsed string to number';
  },
  inputType: 'number',
  outputType: 'number',
  params: manipulateNumberParams,
}