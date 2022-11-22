import { MergeBoardType } from '../dto/types';

export interface MergeBoardApplicationInterface {
	execute(data: MergeBoardType): Promise<MergeBoardType | null>;
}
