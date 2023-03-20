export interface TeamUserUseCaseInterface<T, S> {
	execute(args: T): Promise<S>;
}
