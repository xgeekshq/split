export type SelectedValues<T> =
	| string // maintain compatibility with existing code
	| {
			[K in keyof T]?: 1 | 0;
	  };
