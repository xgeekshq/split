import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../interfaces/types';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { BoardPhaseDto } from 'src/libs/dto/board-phase.dto';
import { Team } from '@slack/web-api/dist/response/AdminAppsRequestsListResponse';
import { BOARD_PHASE_SERVER_UPDATED } from 'src/libs/constants/phase';
import { SLACK_ENABLE, SLACK_MASTER_CHANNEL_ID } from 'src/libs/constants/slack';
import { BoardPhases } from 'src/libs/enum/board.phases';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { SlackMessageDto } from 'src/modules/communication/dto/slack.message.dto';
import PhaseChangeEvent from 'src/modules/socket/events/user-updated-phase.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { FRONTEND_URL } from 'src/libs/constants/frontend';
import { SendMessageServiceInterface } from 'src/modules/communication/interfaces/send-message.service.interface';

@Injectable()
export class UpdateBoardPhaseUseCase implements UseCase<BoardPhaseDto, void> {
	constructor(
		@Inject(TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface,
		@Inject(CommunicationsType.TYPES.services.SlackSendMessageService)
		private slackSendMessageService: SendMessageServiceInterface,
		private eventEmitter: EventEmitter2,
		private configService: ConfigService
	) {}

	async execute({ boardId, phase }: BoardPhaseDto) {
		try {
			const board = await this.boardRepository.updatePhase(boardId, phase);

			this.eventEmitter.emit(BOARD_PHASE_SERVER_UPDATED, new PhaseChangeEvent(board));

			//Sends message to SLACK
			if (
				(board.team as Team).name === 'xgeeks' &&
				board.slackEnable === true &&
				board.phase !== BoardPhases.ADDCARDS &&
				this.configService.getOrThrow(SLACK_ENABLE)
			) {
				const message = this.generateMessage(board.phase, boardId, board.createdAt, board.columns);
				const slackMessageDto = new SlackMessageDto(
					this.configService.getOrThrow(SLACK_MASTER_CHANNEL_ID),
					message
				);
				this.slackSendMessageService.execute(slackMessageDto);
			}
		} catch (err) {
			throw new UpdateFailedException();
		}
	}

	/* --------------- HELPERS --------------- */
	private generateMessage(phase: string, boardId: string, date: string, columns): string {
		const createdAt = new Date(date);
		const month = createdAt.toLocaleString('default', {
			month: 'long'
		});
		const frontendUrl = this.configService.getOrThrow(FRONTEND_URL);

		if (phase === BoardPhases.VOTINGPHASE) {
			return (
				`<!here> Hello team :xgeeks:,\n\nThe ${month} Retro Board is now ready to vote <${frontendUrl}/boards/${boardId}|HERE>, take a look and please add your votes.\n\n` +
				`If you spot any problem, remember to help the team, opening an issue on <https://github.com/xgeekshq/split/issues |split github repo> or reach out to the team using <#C02F0J7J99Q|split_dev> Slack channel.\n\n` +
				`Thank you for your collaboration! :ok_hand: Keep rocking :rocket:`
			);
		}

		if (phase === BoardPhases.SUBMITTED) {
			const { cards } = columns[2];
			let actionPoints = '';

			//Extracts the action points to a string
			cards.map((card) => {
				actionPoints += ` \u2022 ${card.text.replace(/\n{2,}/g, '\n\t')} \n`;
			});

			return (
				`Hello team :xgeeks:,\n\nThe ${month} <${frontendUrl}/boards/${boardId}|board> was submitted` +
				(actionPoints ? ' and these are the action points extracted:\n\n' : '!\n') +
				actionPoints +
				'\nThank you for your collaboration! :ok_hand: Keep rocking :rocket:'
			);
		}
	}
}
