import { convertToJson } from './json-tools';
import { stringToList, listToString } from './list-tools';
import { trim, stringify, replace } from './string-tools';

const StringTools = [trim, stringify, replace];
const JsonTools = [convertToJson];
const ListTools = [stringToList, listToString];

const Tools = [...StringTools, ...JsonTools, ...ListTools];

export { StringTools, JsonTools, Tools }