import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { UpdateColumnDto } from 'src/modules/columns/dto/update-column.dto';

export class UpdateColumnUseCaseDto {
	@ApiProperty()
	@IsMongoId()
	@IsNotEmpty()
	boardId: string;

	@ApiProperty({ type: UpdateColumnDto })
	@IsNotEmpty()
	columnData: UpdateColumnDto;

	completionHandler?: () => void;
}
