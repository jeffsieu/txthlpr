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

export type ToolParameter<Type extends ToolParameterType> = {
  name: string,
  value: Type,
  required: boolean,
}

export type json = any;
export type SingleDataType = string | boolean | number;
export type MultiDataType = json | ListDataType<DataType>;

export type DataType = SingleDataType | json | MultiDataType;

export type TypeName<T extends DataType> =
    T extends string ? 'string' :
    T extends boolean ? 'boolean' :
    T extends number ? 'number' :
    // T extends Array<infer S> ? ListTypeName<S> : any;
    T extends any[] ? 'list' : 'json/any';

export interface ListDataType<T extends DataType> extends Array<Data<T>> {

}

// export type ListTypeName<T> = T extends DataType ? `List${TypeName<T>}` : 'List<any>';

export type ToolParameterType = string | boolean;

export interface Data<T extends DataType> {
  get(): T;
  getType(): TypeName<T>;
  transformedWith<OutputType extends DataType>(tool: Tool<T, OutputType>): Data<OutputType>;
}

export class DataBuilder {

  static from<T extends DataType>(data: T): Data<any> {
    if (typeof data === 'string') {
      return new UnitData<string>(data, 'string');
    } else if (typeof data === 'number') {
      return new UnitData<number>(data, 'number');
    } else if (Array.isArray(data)) {
      return new ListData(data);
    } else {
      return new UnitData<unknown>(data, 'json/any');
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

  transformedWith<OutputType extends DataType>(tool: Tool<T, OutputType>): Data<OutputType> {
    const transformedData = tool.transform(this.get());
    console.log('transformed data:');
    console.log(transformedData);
    return DataBuilder.from(transformedData);
  }
}

export class ListData implements Data<any[]> {
  children: Data<any>[];
  childrenTypes: Set<TypeName<any>>;

  constructor(rawChildren: any[]) {
    this.childrenTypes = new Set();
    const children = [];
    console.log(rawChildren);
    for (var child of rawChildren) {
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
    console.log('constructred');
  }

  get(): any[] {
    return this.children.map((child) => child.get());
  }

  getType(): TypeName<any[]> {
    return 'list';
  }

  transformedWith<OutputType extends DataType>(tool: Tool<any[], OutputType>): Data<OutputType> {
    const transformedData = tool.transform(this.get());
    return DataBuilder.from(transformedData);
  }

  childrenTransformedWith<InputType extends DataType, OutputType extends DataType>(tool: Tool<InputType, OutputType>): ListData {
    const transformFunction = (child: Data<any>): Data<any> | Data<OutputType> => {
      if (tool.inputType === child.getType()) {
        console.log()
        return DataBuilder.from(tool.transform(child.get() as InputType));
      } else {
        return child;
      }
    }
    const newData = this.children.map(transformFunction);
    return new ListData(newData);
  }
}

// class JsonData<KeyTypes extends DataType[], ValueTypes extends DataType[]> extends Data<'json'> {
//   keyTypes: DataType[];
//   valueTypes: DataType[];

//   constructor(data: ActualType<'json'>, childrenTypes: ChildrenTypes) {
//     super(data, 'list');
//     this.childrenTypes = childrenTypes;
//   }
// }

// const a: ListData;