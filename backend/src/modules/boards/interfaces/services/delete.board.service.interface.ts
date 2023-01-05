import UserDto from 'src/modules/users/dto/user.dto';

export interface DeleteBoardServiceInterface {
	delete(boardId: string, user: UserDto): Promise<boolean>;
	deleteBoardsByTeamId(teamId: string): Promise<boolean>;
}
