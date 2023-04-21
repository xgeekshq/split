export const DASHBOARD_ROUTE = '/dashboard';
export const START_PAGE_ROUTE = '/';
export const BOARDS_ROUTE = '/boards';
export const USERS_ROUTE = '/users';
export const TEAMS_ROUTE = '/teams';
export const RESET_PASSWORD_ROUTE = '/reset-password';
export const ACCOUNT_ROUTE = '/account';
export const SETTINGS_ROUTE = '/settings';
export const ERROR_500_PAGE = '/500';
export const AZURE_LOGOUT_ROUTE = '/logoutAzure';
export const LOGIN_GUEST_USER = '/login-guest-user';

export const ROUTES = {
  START_PAGE_ROUTE,
  Dashboard: DASHBOARD_ROUTE,
  Boards: BOARDS_ROUTE,
  TeamBoards: (teamId: string) => `${BOARDS_ROUTE}?team=${teamId}`,
  BoardPage: (boardId: string): string => `${BOARDS_ROUTE}/${boardId}`,
  NewBoard: `${BOARDS_ROUTE}/new`,
  NewTeamBoard: (teamId: string) => `${BOARDS_ROUTE}/new?team=${teamId}`,
  NewRegularBoard: `${BOARDS_ROUTE}/new/regular`,
  NewSplitBoard: `${BOARDS_ROUTE}/new/split`,
  Token: RESET_PASSWORD_ROUTE,
  TokenPage: (tokenId: string): string => `${RESET_PASSWORD_ROUTE}/${tokenId}`,
  Teams: TEAMS_ROUTE,
  TeamPage: (teamId: string): string => `${TEAMS_ROUTE}/${teamId}`,
  NewTeam: `${TEAMS_ROUTE}/new`,
  Users: USERS_ROUTE,
  UserPage: (userId: string) => `${USERS_ROUTE}/${userId}`,
  UserGuest: (boardId: string) => `${LOGIN_GUEST_USER}/${boardId}`,
};

export const GetPageTitleByUrl = (url: string): string | undefined =>
  Object.keys(ROUTES).find((key) => ROUTES[key as keyof typeof ROUTES] === url);
