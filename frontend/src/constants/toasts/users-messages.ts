export const SuccessMessages = {
  UPDATE: 'The user was successfully updated.',
  DELETE: 'The user was successfully deleted.',
} as const;

export const ErrorMessages = {
  GET: 'Error getting the users.',
  GET_ONE: 'Error getting the user.',
  UPDATE: 'Error while updating the user.',
  DELETE: 'Error while deleting the user.',
} as const;
