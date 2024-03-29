import React from 'react';

import UserItem, {
  getTeamsCountText,
  UserItemProps,
} from '@/components/Users/UsersList/UserItem/UserItem';
import { UserFactory, UserWithTeamsFactory } from '@/utils/factories/user';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const render = (props: Partial<UserItemProps> = {}) =>
  renderWithProviders(<UserItem userWithTeams={UserWithTeamsFactory.create()} {...props} />, {
    sessionOptions: { user: UserFactory.create({ isSAdmin: true }) },
  });

describe('Components/Users/User/UsersList/UserItem/UserItem', () => {
  it('should render correctly', () => {
    const userWithTeams = UserWithTeamsFactory.create();

    // Act
    const { getByTestId, getByText } = render({ userWithTeams });

    // Assert
    expect(getByTestId('userTitle')).toBeInTheDocument();
    expect(getByText(userWithTeams.user.email)).toBeInTheDocument();
    expect(getByTestId('userItemActions')).toBeInTheDocument();

    if (userWithTeams.teamsNames)
      expect(getByText(getTeamsCountText(userWithTeams.teamsNames))).toBeInTheDocument();
  });
});
