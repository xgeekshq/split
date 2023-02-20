type userName = { firstName: string; lastName?: string };

export const getUsername = (username: string) => {
  const regex = ' ';

  const index = username.indexOf(regex);

  const user: userName = { firstName: '' };

  if (index > -1) {
    user.firstName = username.substring(0, index);
    user.lastName = username.substring(index);
  } else {
    user.firstName = username;
  }
  return user;
};
