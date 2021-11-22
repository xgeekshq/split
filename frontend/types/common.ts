export type Nullable<T> = T | null | undefined;

export interface DataT {
  data: JSON;
}

export interface ErrorT {
  message: string;
}

export interface HeaderBoardType {
  _id?: string;
  title: string;
}
