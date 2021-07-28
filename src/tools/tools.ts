import { convertToJson } from './json-tools';
import { stringToList, listToString, listFilter } from './list-tools';
import { manipulateNumber, stringToNumber } from './number-tools';
import { trim, stringify, replace } from './string-tools';

const stringTools = [trim, stringify, replace];
const jsonTools = [convertToJson];
const listTools = [stringToList, listToString, listFilter];
const numberTools = [stringToNumber, manipulateNumber];

const tools = [...stringTools, ...jsonTools, ...listTools, ...numberTools];

export { tools }