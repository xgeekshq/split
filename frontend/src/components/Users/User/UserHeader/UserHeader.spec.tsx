import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';

import UserHeader, { UserHeaderProps } from '@/components/Users/User/UserHeader/UserHeader';
import { USERS_ROUTE } from '@/constants/routes';
import useTeamsWithoutUser from '@/hooks/teams/useTeamsWithoutUser';
import { UseTeamsWithoutUserQueryReturnType } from '@/types/hooks/teams/useTeamsWithoutUserQueryReturnType';
import { TeamCheckedFactory } from '@/utils/factories/team';
import { UserFactory } from '@/utils/factories/user';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/users' });

const mockUseTeamsWithoutUser = useTeamsWithoutUser as jest.Mock<
  Partial<UseTeamsWithoutUserQueryReturnType>
>;
jest.mock('@/hooks/teams/useTeamsWithoutUser');

const render = (props: Partial<UserHeaderProps> = {}) =>
  renderWithProviders(<UserHeader user={UserFactory.create()} {...props} />, {
    routerOptions: mockRouter,
  });

describe('Components/Users/User/Header', () => {
  beforeEach(() => {
    mockUseTeamsWithoutUser.mockReturnValue({
      fetchTeamsWithoutUser: {
        data: TeamCheckedFactory.createMany(3),
      },
    } as Partial<UseTeamsWithoutUserQueryReturnType>);
  });

  it('should render correctly', () => {
    // Arrange
    const user = UserFactory.create();

    // Act
    const { getByTestId } = render({ user });
    const title = getByTestId('userHeader').querySelector('span');

    // Assert
    expect(title).toHaveTextContent(`${user.firstName} ${user.lastName}`);
  });

  it('should render breadcrumbs correctly', async () => {
    // Arrange
    const user = UserFactory.create();

    // Act
    const { getByTestId } = render({ user });
    const breadcrumbs = getByTestId('userHeader').querySelectorAll('li');
    const [userBreadcrumb, currentUserBreadcrumb] = breadcrumbs;

    fireEvent.click(userBreadcrumb.querySelector('a')!);

    // Assert
    expect(breadcrumbs).toHaveLength(2);
    expect(currentUserBreadcrumb).toHaveTextContent(`${user.firstName} ${user.lastName}`);
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(USERS_ROUTE, USERS_ROUTE, expect.anything());
    });
  });

  it('should be able to open the teams dialog', async () => {
    // Arrange
    const setState = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const useStateMock: any = (initState: boolean) => [initState, setState];
    jest.spyOn(React, 'useState').mockImplementationOnce(useStateMock);

    // Act
    const { getByTestId } = render();
    const button = getByTestId('userHeader').querySelector('button');
    if (button) fireEvent.click(button);

    // Assert
    await waitFor(() => {
      expect(setState).toHaveBeenCalledWith(true);
    });
  });
});
