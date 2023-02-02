import BoardTimerRepository from 'src/modules/boards/repositories/board-timer.repository';
import PauseBoardTimerServiceImpl from 'src/modules/boards/services/pause-board-timer.service';
import SendBoardTimerStateServiceImpl from 'src/modules/boards/services/send-board-timer-state.service';
import SendBoardTimerTimeLeftServiceImpl from 'src/modules/boards/services/send-board-timer-time-left.service';
import StartBoardTimerServiceImpl from 'src/modules/boards/services/start-board-timer.service';
import StopBoardTimerServiceImpl from 'src/modules/boards/services/stop-board-timer.service';
import UpdateBoardTimerDurationServiceImpl from 'src/modules/boards/services/update-board-timer-duration.service';
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
import CreateBoardServiceImpl from './services/create.board.service';
import DeleteBoardServiceImpl from './services/delete.board.service';
import GetBoardServiceImpl from './services/get.board.service';
import UpdateBoardServiceImpl from './services/update.board.service';

export const createBoardService = {
	provide: TYPES.services.CreateBoardService,
	useClass: CreateBoardServiceImpl
};

export const getBoardService = {
	provide: TYPES.services.GetBoardService,
	useClass: GetBoardServiceImpl
};

export const updateBoardService = {
	provide: TYPES.services.UpdateBoardService,
	useClass: UpdateBoardServiceImpl
};

export const deleteBoardService = {
	provide: TYPES.services.DeleteBoardService,
	useClass: DeleteBoardServiceImpl
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
	useClass: SendBoardTimerStateServiceImpl
};

export const startBoardTimerService = {
	provide: TYPES.services.StartBoardTimerService,
	useClass: StartBoardTimerServiceImpl
};

export const pauseBoardTimerService = {
	provide: TYPES.services.PauseBoardTimerService,
	useClass: PauseBoardTimerServiceImpl
};

export const stopBoardTimerService = {
	provide: TYPES.services.StopBoardTimerService,
	useClass: StopBoardTimerServiceImpl
};

export const updateBoardTimerDurationService = {
	provide: TYPES.services.UpdateBoardTimerDurationService,
	useClass: UpdateBoardTimerDurationServiceImpl
};

export const sendBoardTimerTimeLeftService = {
	provide: TYPES.services.SendBardTimerTimeLeftService,
	useClass: SendBoardTimerTimeLeftServiceImpl
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
