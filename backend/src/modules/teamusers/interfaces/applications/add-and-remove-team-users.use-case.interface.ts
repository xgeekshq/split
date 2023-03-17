import TeamUserDto from '../../dto/team.user.dto';
import TeamUser from '../../entities/team.user.schema';

export interface AddAndRemoveTeamUsersUseCaseInterface {
	execute(addUsers: TeamUserDto[], removeUsers: string[]): Promise<TeamUser[]>;
}
