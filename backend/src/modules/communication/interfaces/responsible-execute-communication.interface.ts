import { ChangeResponsibleType } from '../dto/types';

export interface ResponsibleExecuteCommunicationInterface {
	execute(data: ChangeResponsibleType): Promise<ChangeResponsibleType | null>;
}
