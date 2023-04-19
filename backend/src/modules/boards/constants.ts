export const TYPES = {
	applications: {
		DuplicateBoardUseCase: 'DuplicateBoardUseCase',
		GetBoardsForDashboardUseCase: 'GetBoardsForDashboardUseCase',
		GetAllBoardsUseCase: 'GetAllBoardUseCase',
		GetPersonalBoardsUseCase: 'GetPersonalBoardsUseCase',
		GetBoardUseCase: 'GetBoardUseCase',
		CreateBoardUseCase: 'CreateBoardUseCase',
		IsBoardPublicUseCase: 'IsBoardPublicUseCase',
		DeleteBoardUseCase: 'DeleteBoardUseCase',
		UpdateBoardUseCase: 'UpdateBoardUseCase',
		UpdateBoardParticipantsUseCase: 'UpdateBoardParticipantsUseCase',
		MergeBoardUseCase: 'MergeBoardUseCase',
		UpdateBoardPhaseUseCase: 'UpdateBoardPhaseUseCase'
	},
	repositories: {
		BoardTimerRepository: 'BoardTimerRepository',
		BoardRepository: 'BoardRepository'
	},
	subscribers: {
		AfterUserPausedTimerSubscriber: 'AfterUserPausedTimerSubscriber',
		AfterUserStartedTimerSubscriber: 'AfterUserStartedTimerSubscriber',
		AfterUserStoppedTimerSubscriber: 'AfterUserStoppedTimerSubscriber',
		AfterUserUpdatedDurationSubscriber: 'AfterUserUpdatedDurationSubscriber',
		AfterUserRequestedTimerStateSubscriber: 'AfterUserRequestedTimerStateSubscriber'
	}
};

export const CREATE_BOARD_SERVICE = 'CreateBoardService';

export const DELETE_BOARD_SERVICE = 'DeleteBoardService';

export const UPDATE_BOARD_SERVICE = 'UpdateBoardService';

export const GET_BOARD_SERVICE = 'GetBoardService';

export const SEND_BOARD_TIMER_STATE_SERVICE = 'SendBoardTimerStateService';

export const START_BOARD_TIMER_SERVICE = 'StartBoardTimerService';

export const PAUSE_BOARD_TIMER_SERVICE = 'PauseBoardTimerService';

export const STOP_BOARD_TIMER_SERVICE = 'StopBoardTimerService';

export const SEND_BOARD_TIMER_TIME_LEFT_SERVICE = 'SendBoardTimerTimeLeftService';

export const UPDATE_BOARD_TIMER_DURATION_SERVICE = 'UpdateBoardTimerDurationService';
