import { ChangeResponsibleDto } from '../dto/changeResponsible.dto';

export interface ResponsibleExecuteCommunicationInterface {
	execute(data: ChangeResponsibleDto): void;
}
