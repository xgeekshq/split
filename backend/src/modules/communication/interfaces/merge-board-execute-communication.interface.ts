import { MergeBoardCommunicationType } from '../dto/types';

export interface MergeBoardExecuteCommunicationInterface {
	execute(data: MergeBoardCommunicationType): Promise<MergeBoardCommunicationType | null>;
}
