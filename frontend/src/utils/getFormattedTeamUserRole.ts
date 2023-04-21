import { TeamUserRoles } from '@/enums/teams/userRoles';

export const getFormattedTeamUserRole = (role: string): string => {
  if (role === TeamUserRoles.STAKEHOLDER) {
    return role[0].toUpperCase() + role.substring(1);
  }
  return `Team ${role[0].toUpperCase()}${role.substring(1)}`;
};
