export interface SessionInterface {
	startTransaction(): Promise<void>;
	commitTransaction(): Promise<void>;
	abortTransaction(): Promise<void>;
	endSession(): Promise<void>;
}
