export interface SessionInterface {
	startTransaction(): void;
	commitTransaction(): void;
	abortTransaction(): void;
	endSession(): void;
}
