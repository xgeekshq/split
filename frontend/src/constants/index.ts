import getConfig from 'next/config';

import { inSeconds } from '@/types/utils';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

export const UNDEFINED = ' UNDEFINED';
export const ERROR_LOADING_DATA = 'Error loading data';

export const JWT_EXPIRATION_TIME = Number(publicRuntimeConfig.NEXT_PUBLIC_EXPIRATION_TIME);

export const {
  NEXT_PUBLIC_BACKEND_URL,
  NEXT_PUBLIC_NEXTAUTH_URL,
  SECRET,
  NEXT_PUBLIC_RECOIL_DEV_TOOLS,
} = publicRuntimeConfig;

export const CLIENT_ID = serverRuntimeConfig.AZURE_CLIENT_ID;
export const CLIENT_SECRET = serverRuntimeConfig.AZURE_CLIENT_SECRET;
export const TENANT_ID = serverRuntimeConfig.AZURE_TENANT_ID;

export const NEXT_PUBLIC_ENABLE_AZURE = publicRuntimeConfig.NEXT_PUBLIC_ENABLE_AZURE === 'true';
export const NEXT_PUBLIC_ENABLE_GIT = publicRuntimeConfig.NEXT_PUBLIC_ENABLE_GIT === 'true';
export const NEXT_PUBLIC_ENABLE_GOOGLE = publicRuntimeConfig.NEXT_PUBLIC_ENABLE_GOOGLE === 'true';
export const NEXT_PUBLIC_LOGIN_SSO_ONLY = publicRuntimeConfig.NEXT_PUBLIC_LOGIN_SSO_ONLY === 'true';
export const NEXT_PUBLIC_REGULAR_BOARD = publicRuntimeConfig.NEXT_PUBLIC_REGULAR_BOARD
  ? publicRuntimeConfig.NEXT_PUBLIC_REGULAR_BOARD === 'true'
  : true;

export const AUTH_SSO =
  NEXT_PUBLIC_ENABLE_AZURE || NEXT_PUBLIC_ENABLE_GIT || NEXT_PUBLIC_ENABLE_GOOGLE;

export const REFRESH_TOKEN_ERROR = 'REFRESH_TOKEN_ERROR';

export const MIN_MEMBERS = 4;

export const RECOIL_DEV_TOOLS = NEXT_PUBLIC_RECOIL_DEV_TOOLS === 'true';

export const ONE_SECOND = 1000;
export const BOARD_TIMER_USER_STARTED = 'board-timer.user.started';
export const BOARD_TIMER_SERVER_STARTED = 'board-timer.server.started';
export const BOARD_TIMER_USER_PAUSED = 'board-timer.user.paused';
export const BOARD_TIMER_SERVER_PAUSED = 'board-timer.server.paused';
export const BOARD_TIMER_USER_STOPPED = 'board-timer.user.stopped';
export const BOARD_TIMER_SERVER_STOPPED = 'board-timer.server.stopped';
export const BOARD_TIMER_USER_DURATION_UPDATED = 'board-timer.user.duration.updated';
export const BOARD_TIMER_SERVER_DURATION_UPDATED = 'board-timer.server.duration.updated';
export const BOARD_TIMER_SERVER_TIME_LEFT_UPDATED = 'board-timer.server.time-left.updated';
export const BOARD_TIMER_USER_REQUESTED_TIMER_STATE = 'board-timer.user.requested.timer-state';
export const BOARD_TIMER_SERVER_SENT_TIMER_STATE = 'board-timer.server.sent.timer-state';
export const BOARD_TIMER_PROGRESS_BAR_DEFAULT_WIDTH = 186;
export const BOARD_TIMER_START_MINUTES = 5;
export const BOARD_TIMER_START_SECONDS = 0;
export const BOARD_TIMER_JUMP_SECONDS = 5;
export const BOARD_TIMER_JUMP_MINUTES = 1;
export const BOARD_TIMER_MIN_SECONDS = 30;
export const BOARD_TIMER_MIN_MINUTES = 0;
export const BOARD_TIMER_MAX_SECONDS = 60 - BOARD_TIMER_JUMP_SECONDS;
export const BOARD_TIMER_MAX_MINUTES = 59;
export const BOARD_TIMER_TOTAL_TIME =
  inSeconds(BOARD_TIMER_START_MINUTES) + BOARD_TIMER_START_SECONDS;
export const BOARD_TIMER_START_TIME = {
  minutes: BOARD_TIMER_START_MINUTES,
  seconds: BOARD_TIMER_START_SECONDS,
  total: BOARD_TIMER_TOTAL_TIME,
};

export const BOARD_PHASE_SERVER_SENT = 'board-phase.server.updated';

export const CARD_TEXT_DEFAULT = 'Write your comment here...';

export const CARD_TEXT_TO_IMPROVE_SPLIT_COLUMN = `Description: \n\nHow to improve:`;

export const GUEST_USER_COOKIE = 'guest-user-session';
