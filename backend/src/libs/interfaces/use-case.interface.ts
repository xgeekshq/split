export interface UseCase<T, P> {
	execute(props: T): Promise<P>;
}
