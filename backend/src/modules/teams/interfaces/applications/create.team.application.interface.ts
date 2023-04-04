<<<<<<< HEAD
import { CreateTeamDto } from '../../dto/crate-team.dto';
=======
import { CreateTeamDto } from '../../dto/create-team.dto';
import TeamUserDto from '../../../teamUsers/dto/team.user.dto';
import TeamUser from 'src/modules/teamUsers/entities/team.user.schema';
>>>>>>> main
import Team from '../../entities/team.schema';

export interface CreateTeamApplicationInterface {
	create(teamData: CreateTeamDto): Promise<Team>;
}
