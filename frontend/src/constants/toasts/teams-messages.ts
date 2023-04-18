export const SuccessMessages = {
  CREATE: 'The team was successfully created.',
  UPDATE: 'Team member/s successfully updated.',
  UPDATE_USER: 'The team user was successfully updated.',
  UPDATE_TEAM: 'The team(s) was successfully added to the user.',
  DELETE: 'The team was successfully deleted.',
  DELETE_USER: 'The user was successfully removed from the team.',
} as const;

export const ErrorMessages = {
  GET: 'Error getting the teams.',
  GET_ONE: 'Error getting the team.',
  CREATE: 'Error creating the team.',
  UPDATE: 'Error while updating the team.',
  UPDATE_USER: 'Error while updating the team user.',
  UPDATE_TEAM: 'Error while adding team(s) to the user.',
  DELETE: 'Error deleting the team.',
  DELETE_USER: 'Error removing user from the team.',
  INVALID_NAME: 'A team with this name already exists.',
} as const;
