import React from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { fireEvent, waitFor } from '@testing-library/react';

import TeamsDialog, { TeamsDialogProps } from '@/components/Users/User/TeamsDialog/TeamsDialog';
import useUpdateUserTeams from '@/hooks/teams/useUpdateUserTeams';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { TeamCheckedFactory } from '@/utils/factories/team';
import { UserFactory } from '@/utils/factories/user';
import { createMockRouter } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const user = UserFactory.create();
const router = createMockRouter({ query: { userId: user._id } });

const render = (props: Partial<TeamsDialogProps> = {}) =>
  renderWithProviders(
    <TeamsDialog
      isOpen
      confirmationLabel="confirm"
      joinedAt="2022-01-01T00:00:00+00:00"
      setIsOpen={jest.fn()}
      teamsList={TeamCheckedFactory.createMany(3)}
      title="Title"
      {...props}
    />,
    { routerOptions: router },
  );

const mockUseUpdateUserTeams = useUpdateUserTeams as jest.Mock<Partial<UseMutationResult>>;

jest.mock('@/hooks/teams/useUpdateUserTeams');

describe('Components/Users/User/TeamsDialog', () => {
  beforeEach(() => {
    mockUseUpdateUserTeams.mockReturnValue({
      mutate: jest.fn(),
    } as Partial<UseMutationResult>);
  });

  it('should render correctly', () => {
    // Arrange
    const teamsList = TeamCheckedFactory.createMany(3);

    // Act
    const { getAllByTestId, getByTestId } = render({ teamsList });

    // Assert
    expect(getAllByTestId('checkboxTeamItem')).toHaveLength(teamsList.length);
    expect(getByTestId('uncontrolledInput')).toBeInTheDocument();
  });

  it('should call useUpdateUserTeams mutate function', async () => {
    // Arrange
    const updateUserTeamsMutation = jest.fn();

    mockUseUpdateUserTeams.mockReturnValueOnce({
      mutate: updateUserTeamsMutation,
    } as Partial<UseMutationResult>);

    const teamsList = TeamCheckedFactory.createMany(3, [
      { isChecked: false },
      { isChecked: true },
      { isChecked: false },
    ]);

    const mutatedTeamList = [
      {
        user: user._id,
        role: TeamUserRoles.MEMBER,
        team: teamsList[1]._id,
        isNewJoiner: false,
        canBeResponsible: true,
      },
    ];

    // Act
    const { getByTestId } = render({ teamsList });

    fireEvent.click(getByTestId('dialogFooterSubmit'));

    // Assert
    await waitFor(() => {
      expect(updateUserTeamsMutation).toBeCalled();
      expect(updateUserTeamsMutation).toBeCalledWith(mutatedTeamList);
    });
  });
});
