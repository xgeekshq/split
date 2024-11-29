import { UseCase } from 'src/libs/interfaces/use-case.interface';

export interface SynchronizeADUsersCronUseCaseInterface extends UseCase<void, void> {
	execute(): Promise<void>;
}
