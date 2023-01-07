import { Logger } from '@nestjs/common';
import { TeamDto } from 'src/modules/communication/dto/team.dto';
import { BoardRoles, BoardType, ConfigurationType } from 'src/modules/communication/dto/types';
import { UserDto } from 'src/modules/communication/dto/user.dto';
import { BoardNotValidError } from 'src/modules/communication/errors/board-not-valid.error';
import { ChatHandlerInterface } from 'src/modules/communication/interfaces/chat.handler.interface';
import { CommunicationApplicationInterface } from 'src/modules/communication/interfaces/communication.application.interface';
import { ConversationsHandlerInterface } from 'src/modules/communication/interfaces/conversations.handler.interface';
import { UsersHandlerInterface } from 'src/modules/communication/interfaces/users.handler.interface';

export class SlackCommunicationApplication implements CommunicationApplicationInterface {
	private logger = new Logger(SlackCommunicationApplication.name);

	constructor(
		private readonly config: ConfigurationType,
		private readonly conversationsHandler: ConversationsHandlerInterface,
		private readonly usersHandler: UsersHandlerInterface,
		private readonly chatHandler: ChatHandlerInterface
	) {}

	public async execute(board: BoardType): Promise<TeamDto[]> {
		let teams = this.makeTeams(board);
		teams = await this.addSlackIdOnTeams(teams);
		teams = await this.createAllChannels(teams);
		teams = await this.inviteAllMembers(teams);
		await this.postMessageOnEachChannel(teams);
		await this.postMessageOnMasterChannel(teams);

		return teams;
	}

	private async postMessageOnMasterChannel(teams: TeamDto[]): Promise<void> {
		const textGeneralTeams = teams
			.filter((i) => i.for === BoardRoles.MEMBER)
			.reduce((text, team) => {
				text += `\n${team.name}:\n`;
				team.participants.forEach((i, idx) => {
					text += `${idx + 1}. ${i.firstName} ${i.lastName}`;

					if (i.responsible) {
						text += ` *- Responsible*`;
					}
					text += '\n';
				});

				return text;
			}, '');

		const today = new Date();
		const until = new Date(today.setMonth(today.getMonth() + 1)).toLocaleDateString('en-US', {
			month: 'long'
		});

		const generalText = `<!channel> \n*${teams[0].name} monthly-${until}* \nIn order to proceed with the retro of this month, here are the random teams: \n\n
    ${textGeneralTeams} \n
    Each team has a *random* selected responsible, in order to create the board, organize the retro and everything else that is described in the doc(https://confluence.kigroup.de/display/OX/Retro) :eyes: :thumbsup:\n\n
    This must be done until \`${until} 1st\`\n\n
    All the channels needed have been created automatically for your team and another one for responsibles of the teams.\n\n
    Talent wins games, but teamwork and intelligence wins championships. :fire: :muscle:`;

		this.chatHandler.postMessage(this.config.slackMasterChannelId, generalText);
	}

	private async postMessageOnEachChannel(teams: TeamDto[]): Promise<void> {
		const generalText = {
			member: (
				boardId: string
			) => `<!channel> In order to proceed with the retro of this month, here is the board link: \n\n
      ${this.config.frontendUrl}/boards/${boardId}
      `,
			responsible: (
				boardId: string
			) => `<!channel> In order to proceed with the retro of this month, here is the main board link: \n\n
      ${this.config.frontendUrl}/boards/${boardId}
      `
		};

		const postMessagePromises = teams.map((i) =>
			this.chatHandler.postMessage(i.channelId as string, generalText[i.for](i.boardId))
		);

		await this.resolvePromises(postMessagePromises);
	}

	private async inviteAllMembers(teams: TeamDto[]): Promise<TeamDto[]> {
		const invitePromises = teams
			.filter((i) => typeof i.channelId === 'string')
			.filter((i) => i.participants.length > 0)
			.map((i) =>
				this.conversationsHandler.inviteUsersToChannel(i.channelId as string, i.participants)
			);

		// !! what to do if some errors !!
		const [success, errors] = await this.resolvePromises(invitePromises);

		errors.forEach((i) => this.logger.warn(i));

		success.forEach(({ channelId, fails }) => {
			const board = teams
				.filter((i) => typeof i.channelId === 'string')
				.filter((i) => i.participants.length > 0)
				.find((i) => i.channelId === channelId);

			if (board) {
				board.participantsNotInvited = fails;
			}
		});

		return teams;
	}

	private async createAllChannels(teams: TeamDto[]): Promise<TeamDto[]> {
		const today = new Date();
		const year = today.getFullYear();
		const month = today.toLocaleString('default', { month: 'long' }).toLowerCase();
		const createChannelsPromises = teams.map((i) =>
			this.conversationsHandler.createChannel(
				`${i.normalName}${i.for === BoardRoles.RESPONSIBLE ? '-responsibles' : ''}-${month}-${year}`
			)
		);

		// !! what to do if some errors !!
		const [success, errors] = await this.resolvePromises(createChannelsPromises);

		errors.forEach((i) => this.logger.warn(i));

		success.forEach(({ id: channelId, name: channelName }) => {
			const board = teams.find((i) =>
				channelName.includes(
					`${i.normalName}${i.for === BoardRoles.RESPONSIBLE ? '-responsibles' : ''}`
				)
			);

			if (board) {
				board.channelId = channelId;
			}
		});

		return teams;
	}

	private async addSlackIdOnTeams(teams: TeamDto[]): Promise<TeamDto[]> {
		const usersIdsOnSlack = await this.conversationsHandler.getUsersFromChannelSlowly(
			this.config.slackMasterChannelId as string
		);
		const usersProfiles = await this.usersHandler.getProfilesByIds(usersIdsOnSlack);

		return teams.map((i) => {
			const participants: UserDto[] = [];
			i.participants.forEach((participant) => {
				const found = usersProfiles.find((profile) => profile.email === participant.email);

				if (found) {
					participants.push({
						...participant,
						slackId: found.id
					});
				}
			});

			return {
				...i,
				participants
			};
		});
	}

	private makeTeams(board: BoardType): TeamDto[] {
		if (!this.isValid(board)) {
			this.logger.error('makeTeams - board is not valid');
			throw new BoardNotValidError();
		}

		const normalizeName = (name: string) => {
			// only contain lowercase letters, numbers, hyphens, and underscores, and must be 80 characters or less
			const fullName = `${this.config.slackChannelPrefix}${name}`;

			return fullName
				.replace(/\s/, '_')
				.replace(/[^a-zA-Z0-9-_]/g, '')
				.substring(0, 80)
				.toLowerCase();
		};

		const teams: TeamDto[] = [
			{
				name: board.title,
				normalName: normalizeName(board.title),
				boardId: board.id,
				type: board.isSubBoard ? 'sub-team' : 'team',
				for: BoardRoles.RESPONSIBLE,
				participants: board.isSubBoard
					? ([this.getUsersInBoardByRole(board, BoardRoles.RESPONSIBLE)].filter(
							(i) => !!i
					  ) as UserDto[])
					: this.getAllUsersInDividedBoardsByRole(board, BoardRoles.RESPONSIBLE)
			}
		];

		board.dividedBoards.forEach((subBoard) => {
			const participants = subBoard.users
				// .filter((i) => typeof i.user !== 'string')
				.map((i) => {
					i.user.board = i.board;

					return UserDto.FromUser(i.user, i.role === BoardRoles.RESPONSIBLE);
				});

			teams.push({
				name: subBoard.title,
				normalName: normalizeName(subBoard.title),
				boardId: subBoard.id,
				type: 'sub-team',
				for: BoardRoles.MEMBER,
				participants
			});
		});

		return teams;
	}

	private isValid(board: BoardType): boolean {
		// should check if id and title is set
		// should check if in dividedBoard all users are objects with a valid user

		const usersFromDividedBoards = (
			Array.isArray(board?.dividedBoards) ? board.dividedBoards : ([] as BoardType[])
		)
			.map((i) => i.users.map((j) => j.user))
			.flat();

		if (usersFromDividedBoards.some((i) => !i || typeof i !== 'object')) {
			return false;
		}

		return !!board.id && !!board.title;
	}

	// return the responsible in the board
	private getUsersInBoardByRole(board: BoardType, role: BoardRoles): UserDto | null {
		const users = board.users.find((i) => i.role === role);

		if (users && typeof users.user !== 'string') {
			users.user.board = users.board;

			return UserDto.FromUser(users.user, true);
		}

		return null;
	}

	// return the list of all responsibles for each team
	private getAllUsersInDividedBoardsByRole(board: BoardType, role: BoardRoles): UserDto[] {
		return board.dividedBoards.reduce((acc, item) => {
			const users = this.getUsersInBoardByRole(item, role);

			return [...acc, ...(users ? [users] : [])];
		}, [] as UserDto[]);
	}

	private async resolvePromises(promises: Promise<any>[]): Promise<[any[], any[]]> {
		const results = await Promise.allSettled(promises);
		const success = results
			.filter((i) => i.status === 'fulfilled')
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			.map((i) => i.value);

		const errors = results
			.filter((i) => i.status === 'rejected')
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			.map((i) => (typeof i.reason === 'string' ? i.reason : i.reason.message));

		return [success, errors];
	}
}
