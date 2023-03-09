export const TYPES = {
	services: {
		CreateBoardUserService: 'CreateBoardUserService'
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
