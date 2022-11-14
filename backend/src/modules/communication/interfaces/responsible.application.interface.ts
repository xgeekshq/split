import { ChangeResponsibleType } from '../dto/types';

export interface ResponsibleApplicationInterface {
	execute(data: ChangeResponsibleType): Promise<ChangeResponsibleType | null>;
}
