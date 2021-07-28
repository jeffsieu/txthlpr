import { strict as assert } from "assert";

export type Tool<S extends DataType, T extends DataType, P extends ToolParameters | undefined = undefined> = 
  P extends ToolParameters ? 
   ToolWithParams<S, T, P> : BaseTool<S, T>;

export type ElementWiseTool<S extends DataType, T extends DataType, P extends ToolParameters | undefined = undefined> = Tool<S, T, P> & {
  isElementWise: true,
};

export function isElementWiseTool(tool: Tool<any, any, any>): tool is ElementWiseTool<any, any, any> {
  return (tool as ElementWiseTool<any, any>).isElementWise !== undefined;
}

type ToolWithParams<S extends DataType, T extends DataType, P extends ToolParameters> = BaseTool<S, T> & {
  params: P,
}

export function hasParams<S extends DataType, T extends DataType>(tool: Tool<S, T>): tool is ToolWithParams<S, T, any> {
  return (tool as any).params !== undefined;
}

type BaseTool<S extends DataType, T extends DataType> = {
  name: string,
  description: string,
  transform: (input: S) => T,
  getHistoryDescription: () => string,
  inputType: TypeName<S>,
  outputType: TypeName<T>,
}

export type ToolParameters = {
  [key: string]: ToolParameter<any>,
}

/// So that the app knows how to handle nested tools
export type ToolWithTypePath<S extends DataType, T extends DataType, P extends ToolParameters | undefined = undefined> = Tool<S, T, P> & {
  typePath: TypeName<any>[],
}

export type ToolParameter<Type extends ToolParameterType> = ToolValueParameter<Type> | ToolOptionParameter<Type, readonly string[]>;

type BaseToolParameter<Type extends ToolParameterType> = {
  name: string,
  value: Type,
  required: boolean,
}

type ToolValueParameter<Type extends ToolParameterType> = BaseToolParameter<Type> & {
  value: Type,
  valueType: TypeName<Type>,
  choiceType: 'freeResponse',
};

type ToolOptionParameter<Type extends ToolParameterType, ToolOption extends readonly string[]> = BaseToolParameter<Type> & {
  value: ElementType<ToolOption>,
  choiceType: 'multipleChoice',
  choices: ToolOption,
}

// type FreeResponseParamType = 'freeResponse';
// type MultipleChoiceParamType = 'multipleChoice';
// export type ToolParameterChoiceType = FreeResponseParamType | MultipleChoiceParamType;

export function isMultipleChoiceParam<Type extends ToolParameterType>(param: ToolParameter<Type>): param is ToolOptionParameter<Type, readonly string[]> {
  return param.choiceType === 'multipleChoice';
}

export type json = any;
export type SingleDataType = string | boolean | number;
export type MultiDataType = json | ListDataType<DataType>;

export type DataType = SingleDataType | json | MultiDataType;

export type TypeName<T extends DataType> =
    T extends string ? 'string' :
    T extends boolean ? 'boolean' :
    T extends number ? 'number' :
    T extends any[] ? 'list' : 'json' | 'any';

export interface ListDataType<T extends DataType> extends Array<Data<T>> {
}

export type ElementType < T extends ReadonlyArray < unknown > > = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never

export type SelfToolMap = Map<string, ToolMapValue>;

export type ToolMap = {
  self: SelfToolMap,
  type: TypeName<any>,
  children?: ChildrenToolMap,
}

export type ToolMapValue = Tool<any, any>[];

export type ChildrenToolMap = Map<string, ToolMap>;

export type ToolParameterType = string | boolean;

export interface Data<T extends DataType> {
  get(): T;
  getType(): TypeName<T>;
  transformedWith<OutputType extends DataType>(tool: ToolWithTypePath<T, OutputType>): Data<OutputType>;
}
export class DataBuilder {

  static from<T extends DataType>(data: T): Data<any> {
    if (typeof data === 'string') {
      return new UnitData<string>(data, 'string');
    } else if (typeof data === 'number') {
      return new UnitData<number>(data, 'number');
    } else if (Array.isArray(data)) {
      return new ListData(data);
    } else if (typeof data === 'object' && data !== null) {
      return new JsonData(data);
    } else {
      return new UnitData<unknown>(data, 'any');
    }
  }

  // static from<T extends DataType>(data: T, type: TypeName<T>): Data<T> {
  //   if (Array.isArray(data)) {
  //     return (new ListData(data) as any);
  //   } else {
  //     return new UnitData(data, type);
  //   }
  // }
}

export class UnitData<T extends DataType> implements Data<T> {
  data: T;
  type: TypeName<T>;

  constructor(data: T, type: TypeName<T>) {
    this.data = data;
    this.type = type;
  }

  get(): T {
    return this.data;
  }

  getType(): TypeName<T> {
    return this.type;
  }

  transformedWith<OutputType extends DataType>(tool: ToolWithTypePath<T, OutputType>): Data<OutputType> {
    const transformedData = tool.transform(this.get());
    return DataBuilder.from(transformedData);
  }
}

export class ListData implements Data<any[]> {
  children: Data<any>[];
  childrenTypes: Set<TypeName<any>>;

  constructor(rawChildren: any[]) {
    this.childrenTypes = new Set();
    const children = [];
    for (let child of rawChildren) {
      if (child instanceof UnitData || child instanceof ListData) {
        this.childrenTypes.add(child.getType());
        children.push(child);
      } else {
        const childData = DataBuilder.from(child);
        this.childrenTypes.add(childData.getType());
        children.push(childData);
      }
    }
    this.children = children;
  }

  get(): any[] {
    return this.children.map((child) => child.get());
  }

  getType(): TypeName<any[]> {
    return 'list';
  }

  transformedWith<OutputType extends DataType>(tool: ToolWithTypePath<any[], OutputType>): Data<any> {
     if (tool.typePath.length > 1) {
       assert(tool.typePath[0] === 'list');
       return this.childrenTransformedWith({
        ...tool,
        typePath: tool.typePath.slice(1),
       });
    } else {
      const transformedData = tool.transform(this.get());
      return DataBuilder.from(transformedData);
    }
  }

  childrenTransformedWith<InputType extends DataType, OutputType extends DataType>(tool: ToolWithTypePath<InputType, OutputType>): ListData {
    const transformFunction = (child: Data<any>): Data<any> | Data<OutputType> => {
      if (tool.typePath[0] === child.getType()) {
        return child.transformedWith(tool);
        // return DataBuilder.from(tool.transform(child.get() as InputType));
      } else {
        return child;
      }
    }
    const newData = this.children.map(transformFunction);
    return new ListData(newData);
  }
}


export class JsonData implements Data<any> {
  map: Map<UnitData<any>, Data<any>>;

  constructor(json: any) {
    assert(!Array.isArray(json));
    const map = new Map();
    // At this point, assume we have a valid json
    for (var entry of Object.entries(json)) {
      const [key, value] = entry;
      map.set(DataBuilder.from(key) as UnitData<any>, DataBuilder.from(value));
    }
    this.map = map;
  }

  get(): any {
    const entries = [];
    const entryIterator = this.map.entries();
    var entry = entryIterator.next();
    while (!entry.done) {
      const [keyData, valueData] = entry.value;
      entries.push([keyData.get(), valueData.get()]);
      entry = entryIterator.next();
    }
    return Object.fromEntries(entries);
  }

  getType(): TypeName<any> {
    return 'json';
  }

  transformedWith<OutputType extends any>(tool: BaseTool<any, OutputType>): Data<OutputType> {
    const transformedData = tool.transform(this.get());
    return DataBuilder.from(transformedData);
  }
}
