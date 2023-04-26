import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { DeleteCardsFromColumnDto } from 'src/modules/columns/dto/delete-cards-from-column.dto';

export class DeleteCardsFromColumnUseCaseDto {
	@ApiProperty()
	@IsMongoId()
	@IsNotEmpty()
	boardId: string;

	@ApiProperty({ type: DeleteCardsFromColumnDto })
	@IsNotEmpty()
	columnToDelete: DeleteCardsFromColumnDto;

	completionHandler?: () => void;
}
