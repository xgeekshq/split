import UserDto from 'src/modules/users/dto/user.dto';

export interface DeleteBoardApplicationInterface {
	delete(boardId: string, user: UserDto): Promise<boolean>;
}
