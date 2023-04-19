/* SERVICES */

export const CREATE_BOARD_SERVICE = 'CreateBoardService';

export const GET_BOARD_SERVICE = 'GetBoardService';

export const UPDATE_BOARD_SERVICE = 'UpdateBoardService';

export const DELETE_BOARD_SERVICE = 'DeleteBoardService';

export const SEND_BOARD_TIMER_STATE_SERVICE = 'SendBoardTimerStateService';

export const START_BOARD_TIMER_SERVICE = 'StartBoardTimerService';

export const PAUSE_BOARD_TIMER_SERVICE = 'PauseBoardTimerService';

export const STOP_BOARD_TIMER_SERVICE = 'StopBoardTimerService';

export const SEND_BOARD_TIMER_TIME_LEFT_SERVICE = 'SendBoardTimerTimeLeftService';

export const UPDATE_BOARD_TIMER_DURATION_SERVICE = 'UpdateBoardTimerDurationService';

/* USE CASES */

export const CREATE_BOARD_USE_CASE = 'CreateBoardUseCase';

export const GET_DASHBOARD_BOARDS_USE_CASE = 'GetDashboardBoardsUseCase';

export const GET_ALL_BOARDS_USE_CASE = 'GetAllBoardUseCase';

export const GET_PERSONAL_BOARDS_USE_CASE = 'GetPersonalBoardsUseCase';

export const GET_BOARD_USE_CASE = 'GetBoardUseCase';

export const UPDATE_BOARD_USE_CASE = 'UpdateBoardUseCase';

export const DELETE_BOARD_USE_CASE = 'DeleteBoardUseCase';

export const IS_BOARD_PUBLIC_USE_CASE = 'IsBoardPublicUseCase';

export const DUPLICATE_BOARD_USE_CASE = 'DuplicateBoardUseCase';

export const UPDATE_BOARD_PARTICIPANTS_USE_CASE = 'UpdateBoardParticipantsUseCase';

export const MERGE_BOARD_USE_CASE = 'MergeBoardUseCase';

export const UPDATE_BOARD_PHASE_USE_CASE = 'UpdateBoardPhaseUseCase';

/* REPOSITORIES */

export const BOARD_TIMER_REPOSITORY = 'BoardTimerRepository';

export const BOARD_REPOSITORY = 'BoardRepository';

/* SUBSCRIBERS */

export const AFTER_USER_PAUSED_TIMER_SUBSCRIBER = 'AfterUserPausedTimerSubscriber';

export const AFTER_USER_STARTED_TIMER_SUBSCRIBER = 'AfterUserStartedTimerSubscriber';

export const AFTER_USER_STOPPED_TIMER_SUBSCRIBER = 'AfterUserStoppedTimerSubscriber';

export const AFTER_USER_UPDATED_DURATION_SUBSCRIBER = 'AfterUserUpdatedDurationSubscriber';

export const AFTER_USER_REQUESTED_TIMER_STATE_SUBSCRIBER = 'AfterUserRequestedTimerStateSubscriber';
