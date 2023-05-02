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
import { GetDashboardBoardsUseCase } from './applications/get-dashboard-boards.use-case';
import { GetPersonalBoardsUseCase } from './applications/get-personal-boards.use-case';
import { IsBoardPublicUseCase } from './applications/is-board-public.use-case';
import {
	AFTER_USER_PAUSED_TIMER_SUBSCRIBER,
	AFTER_USER_REQUESTED_TIMER_STATE_SUBSCRIBER,
	AFTER_USER_STARTED_TIMER_SUBSCRIBER,
	AFTER_USER_STOPPED_TIMER_SUBSCRIBER,
	AFTER_USER_UPDATED_DURATION_SUBSCRIBER,
	BOARD_REPOSITORY,
	BOARD_TIMER_REPOSITORY,
	CREATE_BOARD_SERVICE,
	CREATE_BOARD_USE_CASE,
	DELETE_BOARD_SERVICE,
	DELETE_BOARD_USE_CASE,
	DUPLICATE_BOARD_USE_CASE,
	GET_ALL_BOARDS_USE_CASE,
	GET_BOARD_SERVICE,
	GET_BOARD_USE_CASE,
	GET_DASHBOARD_BOARDS_USE_CASE,
	GET_PERSONAL_BOARDS_USE_CASE,
	IS_BOARD_PUBLIC_USE_CASE,
	MERGE_BOARD_USE_CASE,
	PAUSE_BOARD_TIMER_SERVICE,
	SEND_BOARD_TIMER_STATE_SERVICE,
	SEND_BOARD_TIMER_TIME_LEFT_SERVICE,
	START_BOARD_TIMER_SERVICE,
	STOP_BOARD_TIMER_SERVICE,
	UPDATE_BOARD_PARTICIPANTS_USE_CASE,
	UPDATE_BOARD_PHASE_USE_CASE,
	UPDATE_BOARD_SERVICE,
	UPDATE_BOARD_TIMER_DURATION_SERVICE,
	UPDATE_BOARD_USE_CASE
} from './constants';
import { BoardRepository } from './repositories/board.repository';
import CreateBoardService from './services/create.board.service';
import DeleteBoardService from './services/delete.board.service';
import GetBoardService from './services/get.board.service';
import UpdateBoardService from './services/update.board.service';
import { UpdateBoardUseCase } from './applications/update-board.use-case';
import { UpdateBoardUsersUseCase } from '../boardUsers/applications/update-board-users.use-case';
import { MergeBoardUseCase } from './applications/merge-board.use-case';
import { UpdateBoardPhaseUseCase } from './applications/update-board-phase.use-case';

/* SERVICES */

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

/* USE CASES */

export const createBoardUseCase = {
	provide: CREATE_BOARD_USE_CASE,
	useClass: CreateBoardUseCase
};

export const getDashboardBoardsUseCase = {
	provide: GET_DASHBOARD_BOARDS_USE_CASE,
	useClass: GetDashboardBoardsUseCase
};

export const getAllBoardsUseCase = {
	provide: GET_ALL_BOARDS_USE_CASE,
	useClass: GetAllBoardsUseCase
};

export const getPersonalBoardsUseCase = {
	provide: GET_PERSONAL_BOARDS_USE_CASE,
	useClass: GetPersonalBoardsUseCase
};

export const updateBoardUseCase = {
	provide: UPDATE_BOARD_USE_CASE,
	useClass: UpdateBoardUseCase
};

export const deleteBoardUseCase = {
	provide: DELETE_BOARD_USE_CASE,
	useClass: DeleteBoardUseCase
};

export const getBoardUseCase = {
	provide: GET_BOARD_USE_CASE,
	useClass: GetBoardUseCase
};

export const duplicateBoardUseCase = {
	provide: DUPLICATE_BOARD_USE_CASE,
	useClass: DuplicateBoardUseCase
};

export const isBoardPublicUseCase = {
	provide: IS_BOARD_PUBLIC_USE_CASE,
	useClass: IsBoardPublicUseCase
};

export const updateBoardParticipantsUseCase = {
	provide: UPDATE_BOARD_PARTICIPANTS_USE_CASE,
	useClass: UpdateBoardUsersUseCase
};

export const mergeBoardUseCase = {
	provide: MERGE_BOARD_USE_CASE,
	useClass: MergeBoardUseCase
};

export const updateBoardPhaseUseCase = {
	provide: UPDATE_BOARD_PHASE_USE_CASE,
	useClass: UpdateBoardPhaseUseCase
};

/* REPOSITORIES */

export const boardTimerRepository = {
	provide: BOARD_TIMER_REPOSITORY,
	useClass: BoardTimerRepository
};

export const boardRepository = {
	provide: BOARD_REPOSITORY,
	useClass: BoardRepository
};

/* SUBSCRIBERS */

export const afterUserUpdatedDurationSubscriber = {
	provide: AFTER_USER_UPDATED_DURATION_SUBSCRIBER,
	useClass: AfterUserUpdatedDurationSubscriber
};

export const afterUserPausedTimerSubscriber = {
	provide: AFTER_USER_PAUSED_TIMER_SUBSCRIBER,
	useClass: AfterUserPausedTimerSubscriber
};

export const afterUserStartedTimerSubscriber = {
	provide: AFTER_USER_STARTED_TIMER_SUBSCRIBER,
	useClass: AfterUserStartedTimerSubscriber
};

export const afterUserStoppedTimerSubscriber = {
	provide: AFTER_USER_STOPPED_TIMER_SUBSCRIBER,
	useClass: AfterUserStoppedTimerSubscriber
};

export const afterUserRequestedTimerStateSubscriber = {
	provide: AFTER_USER_REQUESTED_TIMER_STATE_SUBSCRIBER,
	useClass: AfterUserRequestedTimerStateSubscriber
};
