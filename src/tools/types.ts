export type Tool<S extends DataType, T extends DataType, P extends ToolParameters | undefined = undefined> = 
  P extends ToolParameters ? 
   ToolWithParams<S, T, P> : BaseTool<S, T>;

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
    T extends Array<infer S> ? 'list' : 'json/any';

export interface ListDataType<T extends DataType> extends Array<Data<T>> {

}

// export type ListTypeName<T> = T extends DataType ? `List${TypeName<T>}` : 'List<any>';

export type ToolParameterType = string | boolean;

export class Data<T extends DataType> {
  data: T;
  type: TypeName<T>;

  constructor(data: T, type: TypeName<T>) {
    this.data = data;
    this.type = type;
  }

  static from<T extends DataType>(data: T, type: TypeName<T>): Data<T> {
    if (Array.isArray(data)) {
      return (new ListData(data, 'list') as any);
    } else {
      return new Data(data, type);
    }
  }

  transformedWith<OutputType extends DataType>(tool: Tool<T, OutputType>): Data<OutputType> {
    const transformedData = tool.transform(this.data);
    return new Data(transformedData, tool.outputType);
  }
}

class SingleData<Type extends SingleDataType> extends Data<Type> {
}

type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

export class ListData<ChildrenType extends DataType> extends Data<ListDataType<ChildrenType>> {
  childrenTypes: Set<TypeName<ChildrenType>>;

  constructor(data: Array<Data<ChildrenType>>, type: TypeName<ListDataType<ChildrenType>>) {
    super(data, type);
    this.childrenTypes = new Set();
    for (var child of data) {
      this.childrenTypes.add(child.type);
    }
  }

  childrenTransformedWith<InputType extends ChildrenType, OutputType extends DataType>(tool: Tool<InputType, OutputType>): ListData<ChildrenType | OutputType> {
    const transformFunction = (child: Data<ChildrenType>): Data<ChildrenType> | Data<OutputType> => {
      if (tool.inputType === child.type) {
        return Data.from(tool.transform(child.data as InputType), tool.outputType);
      } else {
        return child;
      }
    }
    const newData = this.data.map(transformFunction);
    return new ListData<ChildrenType | OutputType>(newData, 'list');
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