import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Team } from '@slack/web-api/dist/response/AdminAppsRequestsListResponse';
import { FRONTEND_URL } from 'src/libs/constants/frontend';
import { BOARD_PHASE_SERVER_UPDATED } from 'src/libs/constants/phase';
import { SLACK_ENABLE, SLACK_MASTER_CHANNEL_ID } from 'src/libs/constants/slack';
import { BoardPhaseDto } from 'src/libs/dto/board-phase.dto';
import { BoardPhases } from 'src/libs/enum/board.phases';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { SlackMessageDto } from 'src/modules/communication/dto/slack.message.dto';
import { SendMessageServiceInterface } from 'src/modules/communication/interfaces/send-message.service.interface';
import * as CommunicationsType from 'src/modules/communication/interfaces/types';
import PhaseChangeEvent from 'src/modules/socket/events/user-updated-phase.event';
import { TYPES } from '../interfaces/types';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';

@Injectable()
export class UpdateBoardPhaseUseCase implements UseCase<BoardPhaseDto, void> {
	constructor(
		@Inject(TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface,
		@Inject(CommunicationsType.TYPES.services.SlackSendMessageService)
		private slackSendMessageService: SendMessageServiceInterface,
		private readonly eventEmitter: EventEmitter2,
		private readonly configService: ConfigService
	) {}

	async execute({ boardId, phase }: BoardPhaseDto) {
		try {
			const updatedBoard = await this.boardRepository.updatePhase(boardId, phase);

			if (updatedBoard.phase === phase) {
				this.eventEmitter.emit(BOARD_PHASE_SERVER_UPDATED, new PhaseChangeEvent(updatedBoard));

				const isTeamXgeeks = (updatedBoard.team as Team).name === 'xgeeks';
				const boardPhaseIsNotAddCards = updatedBoard.phase !== BoardPhases.ADDCARDS;
				const canSendMessage =
					isTeamXgeeks &&
					updatedBoard.slackEnable &&
					boardPhaseIsNotAddCards &&
					this.configService.getOrThrow(SLACK_ENABLE);

				//Sends message to SLACK
				if (canSendMessage) {
					const message = this.generateMessage(
						updatedBoard.phase,
						boardId,
						updatedBoard.createdAt,
						updatedBoard.columns
					);
					const slackMessageDto = new SlackMessageDto(
						this.configService.getOrThrow(SLACK_MASTER_CHANNEL_ID),
						message
					);
					this.slackSendMessageService.execute(slackMessageDto);
				}
			} else {
				throw new UpdateFailedException();
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
