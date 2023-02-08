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
		CreateBoardApplication: 'CreateBoardApplication',
		DeleteBoardApplication: 'DeleteBoardApplication',
		UpdateBoardApplication: 'UpdateBoardApplication',
		GetBoardApplication: 'GetBoardApplication'
	},
	repositories: {
		BoardTimerRepository: 'BoardTimerRepository'
	},
	subscribers: {
		AfterUserPausedTimerSubscriber: 'AfterUserPausedTimerSubscriber',
		AfterUserStartedTimerSubscriber: 'AfterUserStartedTimerSubscriber',
		AfterUserStoppedTimerSubscriber: 'AfterUserStoppedTimerSubscriber',
		AfterUserUpdatedDurationSubscriber: 'AfterUserUpdatedDurationSubscriber',
		AfterUserRequestedTimerStateSubscriber: 'AfterUserRequestedTimerStateSubscriber'
	}
};
