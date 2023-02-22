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

export const ROUTES = {
  START_PAGE_ROUTE,
  Dashboard: DASHBOARD_ROUTE,
  Boards: BOARDS_ROUTE,
  BoardPage: (boardId: string): string => `/boards/${boardId}`,
  Token: RESET_PASSWORD_ROUTE,
  TokenPage: (tokenId: string): string => `/reset-password/${tokenId}`,
  Teams: TEAMS_ROUTE,
  TeamPage: (teamId: string): string => `/teams/${teamId}`,
  Users: USERS_ROUTE,
  UserEdit: (userId: string) => `/users/${userId}`,
};

export const GetPageTitleByUrl = (url: string): string | undefined =>
  Object.keys(ROUTES).find((key) => ROUTES[key as keyof typeof ROUTES] === url);
