import BoardTimerRepository from 'src/modules/boards/repositories/board-timer.repository';
import AfterUserPausedTimerSubscriber from 'src/modules/boards/subscribers/after-user-paused-timer.subscriber';
import AfterUserRequestedTimerStateSubscriber from 'src/modules/boards/subscribers/after-user-requested-timer-state.subscriber';
import AfterUserStartedTimerSubscriber from 'src/modules/boards/subscribers/after-user-started-timer.subscriber';
import AfterUserStoppedTimerSubscriber from 'src/modules/boards/subscribers/after-user-stopped-timer.subscriber';
import AfterUserUpdatedDurationSubscriber from 'src/modules/boards/subscribers/after-user-updated-duration.subscriber';
import { CreateBoardApplication } from './applications/create.board.application';
import { DeleteBoardApplication } from './applications/delete.board.application';
import { GetBoardApplication } from './applications/get.board.application';
import { UpdateBoardApplication } from './applications/update.board.application';
import { TYPES } from './interfaces/types';
import { BoardRepository } from './repositories/board.repository';
import CreateBoardService from './services/create.board.service';
import DeleteBoardService from './services/delete.board.service';
import GetBoardService from './services/get.board.service';
import PauseBoardTimerService from 'src/modules/boards/services/pause-board-timer.service';
import SendBoardTimerStateService from 'src/modules/boards/services/send-board-timer-state.service';
import SendBoardTimerTimeLeftService from 'src/modules/boards/services/send-board-timer-time-left.service';
import StartBoardTimerService from 'src/modules/boards/services/start-board-timer.service';
import StopBoardTimerService from 'src/modules/boards/services/stop-board-timer.service';
import UpdateBoardTimerDurationService from 'src/modules/boards/services/update-board-timer-duration.service';
import UpdateBoardService from './services/update.board.service';

export const createBoardService = {
	provide: TYPES.services.CreateBoardService,
	useClass: CreateBoardService
};

export const getBoardService = {
	provide: TYPES.services.GetBoardService,
	useClass: GetBoardService
};

export const updateBoardService = {
	provide: TYPES.services.UpdateBoardService,
	useClass: UpdateBoardService
};

export const deleteBoardService = {
	provide: TYPES.services.DeleteBoardService,
	useClass: DeleteBoardService
};

export const createBoardApplication = {
	provide: TYPES.applications.CreateBoardApplication,
	useClass: CreateBoardApplication
};

export const getBoardApplication = {
	provide: TYPES.applications.GetBoardApplication,
	useClass: GetBoardApplication
};

export const updateBoardApplication = {
	provide: TYPES.applications.UpdateBoardApplication,
	useClass: UpdateBoardApplication
};

export const deleteBoardApplication = {
	provide: TYPES.applications.DeleteBoardApplication,
	useClass: DeleteBoardApplication
};

export const boardTimerRepository = {
	provide: TYPES.repositories.BoardTimerRepository,
	useClass: BoardTimerRepository
};

export const sendBoardTimerStateService = {
	provide: TYPES.services.SendBoardTimerStateService,
	useClass: SendBoardTimerStateService
};

export const startBoardTimerService = {
	provide: TYPES.services.StartBoardTimerService,
	useClass: StartBoardTimerService
};

export const pauseBoardTimerService = {
	provide: TYPES.services.PauseBoardTimerService,
	useClass: PauseBoardTimerService
};

export const stopBoardTimerService = {
	provide: TYPES.services.StopBoardTimerService,
	useClass: StopBoardTimerService
};

export const updateBoardTimerDurationService = {
	provide: TYPES.services.UpdateBoardTimerDurationService,
	useClass: UpdateBoardTimerDurationService
};

export const sendBoardTimerTimeLeftService = {
	provide: TYPES.services.SendBardTimerTimeLeftService,
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
