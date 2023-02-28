const getInitials = (firstName: string, lastName: string): string =>
  lastName.length
    ? `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`
    : `${firstName[0].toUpperCase()}`;

export { getInitials };
