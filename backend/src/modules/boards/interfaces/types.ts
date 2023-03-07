export const TYPES = {
	services: {
		CreateBoardService: 'CreateBoardService',
		CreateBoardUserService: 'CreateBoardUserService',
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
		CreateBoardApplication: 'CreateBoardApplication',
		DeleteBoardApplication: 'DeleteBoardApplication',
		UpdateBoardApplication: 'UpdateBoardApplication',
		GetBoardApplication: 'GetBoardApplication'
	},
	repositories: {
		BoardTimerRepository: 'BoardTimerRepository',
		BoardRepository: 'BoardRepository',
		BoardUserRepository: 'BoardUserRepository'
	},
	subscribers: {
		AfterUserPausedTimerSubscriber: 'AfterUserPausedTimerSubscriber',
		AfterUserStartedTimerSubscriber: 'AfterUserStartedTimerSubscriber',
		AfterUserStoppedTimerSubscriber: 'AfterUserStoppedTimerSubscriber',
		AfterUserUpdatedDurationSubscriber: 'AfterUserUpdatedDurationSubscriber',
		AfterUserRequestedTimerStateSubscriber: 'AfterUserRequestedTimerStateSubscriber'
	}
};
