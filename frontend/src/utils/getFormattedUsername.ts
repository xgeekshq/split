export const getFormattedUsername = (firstName: string, lastName: string) =>
  `${
    firstName[0].toUpperCase() + firstName.substring(1)
  } ${lastName[0].toUpperCase()}${lastName.substring(1)}`;
