export type SelectedValues<T> =
	| string // maintain compatibility with existing code
	| {
			[K in keyof T]?: 1 | 0 | undefined;
	  };

export type ModelProps<T> = {
	[K in keyof T]?: T[K];
};
