export const TYPES = {
	services: {
		CreateBoardService: 'CreateBoardService',
		DeleteBoardService: 'DeleteBoardService',
		UpdateBoardService: 'UpdateBoardService',
		GetBoardService: 'GetBoardService',
		SendBoardTimerStateService: 'SendBoardTimerStateService',
		StartBoardTimerService: 'StartBoardTimerService',
		PauseBoardTimerService: 'PauseBoardTimerService',
		StopBoardTimerService: 'StopBoardTimerService',
		SendBardTimerTimeLeftService: 'SendBardTimerTimeLeftService',
		UpdateBoardTimerDurationService: 'UpdateBoardTimerDurationService'
	},
	applications: {
		DuplicateBoardUseCase: 'DuplicateBoardUseCase',
		DeleteBoardApplication: 'DeleteBoardApplication',
		UpdateBoardApplication: 'UpdateBoardApplication',
		GetBoardsForDashboardUseCase: 'GetBoardsForDashboardUseCase',
		GetAllBoardsUseCase: 'GetAllBoardUseCase',
		GetPersonalBoardsUseCase: 'GetPersonalBoardsUseCase',
		GetBoardUseCase: 'GetBoardUseCase',
		CreateBoardUseCase: 'CreateBoardUseCase',
		IsBoardPublicUseCase: 'IsBoardPublicUseCase',
		DeleteBoardUseCase: 'DeleteBoardUseCase'
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
