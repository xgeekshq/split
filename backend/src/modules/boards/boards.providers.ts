import BoardTimerRepository from 'src/modules/boards/repositories/board-timer.repository';
import PauseBoardTimerService from 'src/modules/boards/services/pause-board-timer.service';
import SendBoardTimerStateService from 'src/modules/boards/services/send-board-timer-state.service';
import SendBoardTimerTimeLeftService from 'src/modules/boards/services/send-board-timer-time-left.service';
import StartBoardTimerService from 'src/modules/boards/services/start-board-timer.service';
import StopBoardTimerService from 'src/modules/boards/services/stop-board-timer.service';
import UpdateBoardTimerDurationService from 'src/modules/boards/services/update-board-timer-duration.service';
import AfterUserPausedTimerSubscriber from 'src/modules/boards/subscribers/after-user-paused-timer.subscriber';
import AfterUserRequestedTimerStateSubscriber from 'src/modules/boards/subscribers/after-user-requested-timer-state.subscriber';
import AfterUserStartedTimerSubscriber from 'src/modules/boards/subscribers/after-user-started-timer.subscriber';
import AfterUserStoppedTimerSubscriber from 'src/modules/boards/subscribers/after-user-stopped-timer.subscriber';
import AfterUserUpdatedDurationSubscriber from 'src/modules/boards/subscribers/after-user-updated-duration.subscriber';
import { CreateBoardUseCase } from './applications/create-board.use-case';
import { DeleteBoardUseCase } from './applications/delete-board.use-case';
import { DuplicateBoardUseCase } from './applications/duplicate-board.use-case';
import { GetAllBoardsUseCase } from './applications/get-all-boards.use-case';
import { GetBoardUseCase } from './applications/get-board.use-case';
import { GetBoardsForDashboardUseCase } from './applications/get-boards-for-dashboard.use-case';
import { GetPersonalBoardsUseCase } from './applications/get-personal-boards.use-case';
import { IsBoardPublicUseCase } from './applications/is-board-public.use-case';
import {
	CREATE_BOARD_SERVICE,
	DELETE_BOARD_SERVICE,
	GET_BOARD_SERVICE,
	PAUSE_BOARD_TIMER_SERVICE,
	SEND_BOARD_TIMER_STATE_SERVICE,
	SEND_BOARD_TIMER_TIME_LEFT_SERVICE,
	START_BOARD_TIMER_SERVICE,
	STOP_BOARD_TIMER_SERVICE,
	TYPES,
	UPDATE_BOARD_SERVICE,
	UPDATE_BOARD_TIMER_DURATION_SERVICE
} from './constants';
import { BoardRepository } from './repositories/board.repository';
import CreateBoardService from './services/create.board.service';
import DeleteBoardService from './services/delete.board.service';
import GetBoardService from './services/get.board.service';
import UpdateBoardService from './services/update.board.service';
import { UpdateBoardUseCase } from './applications/update-board.use-case';
import { UpdateBoardParticipantsUseCase } from './applications/update-board-participants.use-case';
import { MergeBoardUseCase } from './applications/merge-board.use-case';
import { UpdateBoardPhaseUseCase } from './applications/update-board-phase.use-case';

export const createBoardService = {
	provide: CREATE_BOARD_SERVICE,
	useClass: CreateBoardService
};

export const getBoardService = {
	provide: GET_BOARD_SERVICE,
	useClass: GetBoardService
};

export const updateBoardService = {
	provide: UPDATE_BOARD_SERVICE,
	useClass: UpdateBoardService
};

export const deleteBoardService = {
	provide: DELETE_BOARD_SERVICE,
	useClass: DeleteBoardService
};

export const duplicateBoardUseCase = {
	provide: TYPES.applications.DuplicateBoardUseCase,
	useClass: DuplicateBoardUseCase
};

export const getBoardsForDashboardUseCase = {
	provide: TYPES.applications.GetBoardsForDashboardUseCase,
	useClass: GetBoardsForDashboardUseCase
};

export const getAllBoardsUseCase = {
	provide: TYPES.applications.GetAllBoardsUseCase,
	useClass: GetAllBoardsUseCase
};

export const getPersonalBoardsUseCase = {
	provide: TYPES.applications.GetPersonalBoardsUseCase,
	useClass: GetPersonalBoardsUseCase
};

export const getBoardUseCase = {
	provide: TYPES.applications.GetBoardUseCase,
	useClass: GetBoardUseCase
};

export const isBoardPublicUseCase = {
	provide: TYPES.applications.IsBoardPublicUseCase,
	useClass: IsBoardPublicUseCase
};

export const updateBoardUseCase = {
	provide: TYPES.applications.UpdateBoardUseCase,
	useClass: UpdateBoardUseCase
};

export const updateBoardParticipantsUseCase = {
	provide: TYPES.applications.UpdateBoardParticipantsUseCase,
	useClass: UpdateBoardParticipantsUseCase
};

export const mergeBoardUseCase = {
	provide: TYPES.applications.MergeBoardUseCase,
	useClass: MergeBoardUseCase
};

export const updateBoardPhaseUseCase = {
	provide: TYPES.applications.UpdateBoardPhaseUseCase,
	useClass: UpdateBoardPhaseUseCase
};

export const deleteBoardUseCase = {
	provide: TYPES.applications.DeleteBoardUseCase,
	useClass: DeleteBoardUseCase
};

export const boardTimerRepository = {
	provide: TYPES.repositories.BoardTimerRepository,
	useClass: BoardTimerRepository
};

export const sendBoardTimerStateService = {
	provide: SEND_BOARD_TIMER_STATE_SERVICE,
	useClass: SendBoardTimerStateService
};

export const startBoardTimerService = {
	provide: START_BOARD_TIMER_SERVICE,
	useClass: StartBoardTimerService
};

export const pauseBoardTimerService = {
	provide: PAUSE_BOARD_TIMER_SERVICE,
	useClass: PauseBoardTimerService
};

export const stopBoardTimerService = {
	provide: STOP_BOARD_TIMER_SERVICE,
	useClass: StopBoardTimerService
};

export const updateBoardTimerDurationService = {
	provide: UPDATE_BOARD_TIMER_DURATION_SERVICE,
	useClass: UpdateBoardTimerDurationService
};

export const sendBoardTimerTimeLeftService = {
	provide: SEND_BOARD_TIMER_TIME_LEFT_SERVICE,
	useClass: SendBoardTimerTimeLeftService
};

export const afterUserUpdatedDurationSubscriber = {
	provide: TYPES.subscribers.AfterUserUpdatedDurationSubscriber,
	useClass: AfterUserUpdatedDurationSubscriber
};

export const afterUserPausedTimerSubscriber = {
	provide: TYPES.subscribers.AfterUserPausedTimerSubscriber,
	useClass: AfterUserPausedTimerSubscriber
};

export const afterUserStartedTimerSubscriber = {
	provide: TYPES.subscribers.AfterUserStartedTimerSubscriber,
	useClass: AfterUserStartedTimerSubscriber
};

export const afterUserStoppedTimerSubscriber = {
	provide: TYPES.subscribers.AfterUserStoppedTimerSubscriber,
	useClass: AfterUserStoppedTimerSubscriber
};

export const afterUserRequestedTimerStateSubscriber = {
	provide: TYPES.subscribers.AfterUserRequestedTimerStateSubscriber,
	useClass: AfterUserRequestedTimerStateSubscriber
};

export const boardRepository = {
	provide: TYPES.repositories.BoardRepository,
	useClass: BoardRepository
};

export const createBoardUseCase = {
	provide: TYPES.applications.CreateBoardUseCase,
	useClass: CreateBoardUseCase
};
