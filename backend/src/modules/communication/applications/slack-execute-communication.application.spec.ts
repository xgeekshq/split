import { faker } from '@faker-js/faker';
import { Logger } from '@nestjs/common';
import {
	ChatMeMessageArguments,
	ConversationsCreateArguments,
	ConversationsInviteArguments,
	ConversationsMembersArguments,
	UsersProfileGetArguments
} from '@slack/web-api';

import { FRONTEND_URL } from 'libs/constants/frontend';
import {
	SLACK_API_BOT_TOKEN,
	SLACK_CHANNEL_PREFIX,
	SLACK_MASTER_CHANNEL_ID
} from 'libs/constants/slack';
import configService from 'libs/test-utils/mocks/configService.mock';
import {
	fillDividedBoardsUsersWithTeamUsers,
	translateBoard
} from 'libs/utils/communication-helpers';
import { SlackCommunicationGateAdapter } from 'modules/communication/adapters/slack-communication-gate.adapter';
import { SlackExecuteCommunication } from 'modules/communication/applications/slack-execute-communication.application';
import { ChatSlackHandler } from 'modules/communication/handlers/chat-slack.handler';
import { ConversationsSlackHandler } from 'modules/communication/handlers/conversations-slack.handler';
import { UsersSlackHandler } from 'modules/communication/handlers/users-slack.handler';

const slackUsersIds = [
	'U023BECGF',
	'U061F7AUR',
	'W012A3CDE',
	'U678BAAGC',
	'U160F7AUZ',
	'W013A3CEF',
	'U111BAXFL',
	'U156F7AOI',
	'W058A3SDQ'
];
jest.mock('@slack/web-api', () => ({
	// eslint-disable-next-line object-shorthand
	WebClient: function WebClient() {
		return {
			conversations: {
				create(options?: ConversationsCreateArguments | undefined) {
					return Promise.resolve({
						ok: true,
						channel: {
							id: `C${faker.random.alphaNumeric(8).toUpperCase()}`,
							name: options?.name
						}
					});
				},
				invite(options?: ConversationsInviteArguments | undefined) {
					return new Promise((resolve, reject) => {
						if (options?.users?.split(',').every((i) => slackUsersIds.includes(i))) {
							resolve({
								ok: true,
								channel: {
									id: options?.channelId
								}
							});
						}

						const dataError = {
							ok: false,
							errors: options?.users
								.split(',')
								.filter((i) => !(slackUsersIds.findIndex((j) => i === j) > -1))
								.map((i) => ({
									user: i,
									ok: false,
									error: 'any_error'
								}))
						};

						// eslint-disable-next-line prefer-promise-reject-errors
						reject({
							data: dataError
						});
					});
				},
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				members(options?: ConversationsMembersArguments | undefined) {
					if (options?.cursor === 'next_cursor') {
						return Promise.resolve({
							ok: true,
							members: slackUsersIds.slice(1),
							response_metadata: {
								next_cursor: null
							}
						});
					}
					return Promise.resolve({
						ok: true,
						members: slackUsersIds.slice(0, 1),
						response_metadata: {
							next_cursor: 'next_cursor' // 'e3VzZXJfaWQ6IFcxMjM0NTY3fQ==',
						}
					});
				}
			},
			users: {
				profile: {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					get(options?: UsersProfileGetArguments | undefined) {
						if (options?.user === 'user_exists_without_email') {
							return Promise.resolve({
								ok: true,
								profile: {
									email: undefined
								}
							});
						}

						const userId = slackUsersIds.find((i) => i === options?.user);
						return Promise.resolve({
							ok: true,
							...(userId
								? {
										profile: {
											email: `${userId}@email.com`
										}
								  }
								: null)
						});
					}
				}
			},
			chat: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				postMessage(options?: ChatMeMessageArguments | undefined) {
					return Promise.resolve({
						ok: true,
						channel: options?.channel
					});
				}
			}
		};
	}
}));

jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn);
jest.spyOn(Logger.prototype, 'warn').mockImplementation(jest.fn);
jest.spyOn(Logger.prototype, 'verbose').mockImplementation(jest.fn);

const getConfiguration = () => ({
	slackApiBotToken: configService.getOrThrow(SLACK_API_BOT_TOKEN),
	slackMasterChannelId: configService.getOrThrow(SLACK_MASTER_CHANNEL_ID),
	slackChannelPrefix: configService.getOrThrow(SLACK_CHANNEL_PREFIX),
	frontendUrl: configService.getOrThrow(FRONTEND_URL)
});

describe('SlackExecuteCommunication', () => {
	let application: SlackExecuteCommunication;
	const communicationGateAdapterMocked = new SlackCommunicationGateAdapter(getConfiguration());

	beforeAll(async () => {
		application = new SlackExecuteCommunication(
			getConfiguration(),
			new ConversationsSlackHandler(communicationGateAdapterMocked),
			new UsersSlackHandler(communicationGateAdapterMocked),
			new ChatSlackHandler(communicationGateAdapterMocked)
		);
	});

	it('should be defined', () => {
		expect(application).toBeDefined();
	});

	it('shoult create channels, invite users, post messages into slack platform and returns all teams created', async () => {
		let givenBoard: any = {
			_id: 'main-board',
			title: 'Main Board',
			dividedBoards: [
				{
					_id: 'sub-team-board-1',
					title: 'Sub-team board 1',
					dividedBoards: [],
					isSubBoard: true,
					users: [
						{
							role: 'member',
							user: slackUsersIds[0],
							board: 'sub-team-board-1'
						},
						{
							role: 'responsible',
							user: slackUsersIds[1],
							board: 'sub-team-board-1'
						},
						{
							role: 'member',
							user: slackUsersIds[2],
							board: 'sub-team-board-1'
						}
					]
				},
				{
					_id: 'sub-team-board-2',
					title: 'Sub-team board 2',
					dividedBoards: [],
					isSubBoard: true,
					users: [
						{
							role: 'member',
							user: slackUsersIds[3],
							board: 'sub-team-board-2'
						},
						{
							role: 'member',
							user: slackUsersIds[4],
							board: 'sub-team-board-2'
						},
						{
							role: 'responsible',
							user: slackUsersIds[5],
							board: 'sub-team-board-2'
						}
					]
				},
				{
					_id: 'sud-team-board-3',
					title: 'Sub-team board 3',
					dividedBoards: [],
					isSubBoard: true,
					users: [
						{
							role: 'responsible',
							user: slackUsersIds[6],
							board: 'sud-team-board-3'
						},
						{
							role: 'member',
							user: slackUsersIds[7],
							board: 'sud-team-board-3'
						},
						{
							role: 'member',
							user: slackUsersIds[8],
							board: 'sud-team-board-3'
						}
					]
				}
			],
			team: {
				users: [
					...slackUsersIds.map((i) => ({
						role: 'member',
						user: {
							_id: i,
							firstName: `first_name_${i}`,
							lastName: `last_name_${i}`,
							email: `${i}@email.com`
						}
					})),
					{
						role: 'stackholder',
						user: {
							_id: 'any_id',
							firstName: 'any_first_name',
							lastName: 'any_last_name',
							email: 'any_email@gmail.com'
						}
					}
				]
			},
			isSubBoard: false
		};
		givenBoard = translateBoard(givenBoard);
		givenBoard = fillDividedBoardsUsersWithTeamUsers(givenBoard);

		const result = await application.execute(givenBoard);

		const expected = [
			{
				name: 'Main Board',
				normalName: 'any_prefix_main_board',
				boardId: 'main-board',
				type: 'team',
				for: 'responsible',
				participants: [
					{
						id: 'U061F7AUR',
						email: 'U061F7AUR@email.com',
						firstName: 'first_name_U061F7AUR',
						lastName: 'last_name_U061F7AUR',
						responsible: true,
						boardId: 'sub-team-board-1',
						slackId: 'U061F7AUR'
					},
					{
						id: 'W013A3CEF',
						email: 'W013A3CEF@email.com',
						firstName: 'first_name_W013A3CEF',
						lastName: 'last_name_W013A3CEF',
						responsible: true,
						boardId: 'sub-team-board-2',
						slackId: 'W013A3CEF'
					},
					{
						id: 'U111BAXFL',
						email: 'U111BAXFL@email.com',
						firstName: 'first_name_U111BAXFL',
						lastName: 'last_name_U111BAXFL',
						responsible: true,
						boardId: 'sud-team-board-3',
						slackId: 'U111BAXFL'
					}
				],
				channelId: 'CU0HPXP8E'
			},
			{
				name: 'Sub-team board 1',
				normalName: 'any_prefix_sub-team_board1',
				boardId: 'sub-team-board-1',
				type: 'sub-team',
				for: 'member',
				participants: [
					{
						id: 'U023BECGF',
						email: 'U023BECGF@email.com',
						firstName: 'first_name_U023BECGF',
						lastName: 'last_name_U023BECGF',
						responsible: false,
						boardId: 'sub-team-board-1',
						slackId: 'U023BECGF'
					},
					{
						id: 'U061F7AUR',
						email: 'U061F7AUR@email.com',
						firstName: 'first_name_U061F7AUR',
						lastName: 'last_name_U061F7AUR',
						responsible: true,
						boardId: 'sub-team-board-1',
						slackId: 'U061F7AUR'
					},
					{
						id: 'W012A3CDE',
						email: 'W012A3CDE@email.com',
						firstName: 'first_name_W012A3CDE',
						lastName: 'last_name_W012A3CDE',
						responsible: false,
						boardId: 'sub-team-board-1',
						slackId: 'W012A3CDE'
					}
				],
				channelId: 'CSJR4G3R0'
			},
			{
				name: 'Sub-team board 2',
				normalName: 'any_prefix_sub-team_board2',
				boardId: 'sub-team-board-2',
				type: 'sub-team',
				for: 'member',
				participants: [
					{
						id: 'U678BAAGC',
						email: 'U678BAAGC@email.com',
						firstName: 'first_name_U678BAAGC',
						lastName: 'last_name_U678BAAGC',
						responsible: false,
						boardId: 'sub-team-board-2',
						slackId: 'U678BAAGC'
					},
					{
						id: 'U160F7AUZ',
						email: 'U160F7AUZ@email.com',
						firstName: 'first_name_U160F7AUZ',
						lastName: 'last_name_U160F7AUZ',
						responsible: false,
						boardId: 'sub-team-board-2',
						slackId: 'U160F7AUZ'
					},
					{
						id: 'W013A3CEF',
						email: 'W013A3CEF@email.com',
						firstName: 'first_name_W013A3CEF',
						lastName: 'last_name_W013A3CEF',
						responsible: true,
						boardId: 'sub-team-board-2',
						slackId: 'W013A3CEF'
					}
				],
				channelId: 'C7JQHTRWT'
			},
			{
				name: 'Sub-team board 3',
				normalName: 'any_prefix_sub-team_board3',
				boardId: 'sud-team-board-3',
				type: 'sub-team',
				for: 'member',
				participants: [
					{
						id: 'U111BAXFL',
						email: 'U111BAXFL@email.com',
						firstName: 'first_name_U111BAXFL',
						lastName: 'last_name_U111BAXFL',
						responsible: true,
						boardId: 'sud-team-board-3',
						slackId: 'U111BAXFL'
					},
					{
						id: 'U156F7AOI',
						email: 'U156F7AOI@email.com',
						firstName: 'first_name_U156F7AOI',
						lastName: 'last_name_U156F7AOI',
						responsible: false,
						boardId: 'sud-team-board-3',
						slackId: 'U156F7AOI'
					},
					{
						id: 'W058A3SDQ',
						email: 'W058A3SDQ@email.com',
						firstName: 'first_name_W058A3SDQ',
						lastName: 'last_name_W058A3SDQ',
						responsible: false,
						boardId: 'sud-team-board-3',
						slackId: 'W058A3SDQ'
					}
				],
				channelId: 'CCP7ISR08'
			}
		];

		result.forEach((i, idx) => {
			expect(i).toEqual(
				expect.objectContaining({
					...expected[idx],
					channelId: expect.stringContaining('C')
				})
			);
		});
	});
});
