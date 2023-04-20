import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { fireEvent, waitFor } from '@testing-library/react';

import { ROUTES } from '@/constants/routes';
import useTeam from '@/hooks/teams/useTeam';
import { createTeamState } from '@/store/team.atom';
import { usersListState } from '@/store/user.atom';
import {
  renderWithProviders,
  RenderWithProvidersOptions,
} from '@/utils/testing/renderWithProviders';
import ListMembers, { ListMembersProps } from '@components/Teams/Team/ListMembers/ListMembers';
import useUpdateTeamUsers from '@hooks/teams/useUpdateTeamUsers';
import useCurrentSession, { UseCurrentSessionResult } from '@hooks/useCurrentSession';
import { TeamUserRoles } from '@utils/enums/team.user.roles';
import { TeamFactory } from '@utils/factories/team';
import { UserListFactory } from '@utils/factories/user';
import { libraryMocks } from '@utils/testing/mocks';
import { verifyIfIsNewJoiner } from '@utils/verifyIfIsNewJoiner';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: ROUTES.NewTeam });

const render = (props?: Partial<ListMembersProps>, options?: Partial<RenderWithProvidersOptions>) =>
  renderWithProviders(<ListMembers isOpen isTeamPage={false} setIsOpen={jest.fn()} {...props} />, {
    routerOptions: mockRouter,
    ...options,
  });

const mockUseUpdateTeamUsers = useUpdateTeamUsers as jest.Mock<Partial<UseMutationResult>>;
const mockUseTeam = useTeam as jest.Mock<Partial<UseQueryResult>>;
const mockUseCurrentSession = useCurrentSession as jest.Mock<Partial<UseCurrentSessionResult>>;

jest.mock('@/hooks/teams/useUpdateTeamUsers');
jest.mock('@/hooks/teams/useTeam');
jest.mock('@/hooks/useCurrentSession');

describe('Teams/CreateTeam', () => {
  beforeEach(() => {
    mockUseUpdateTeamUsers.mockReturnValue({
      mutate: jest.fn(),
    } as Partial<UseMutationResult>);

    mockUseTeam.mockReturnValue({
      data: TeamFactory.create(),
    } as Partial<UseQueryResult>);

    mockUseCurrentSession.mockReturnValue({
      isSAdmin: true,
      userId: '123',
    } as Partial<UseCurrentSessionResult>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update team members list on team page', async () => {
    // Act
    const users = UserListFactory.createMany(2, [{ isChecked: true }, { isChecked: false }]);
    const team = TeamFactory.create();
    const updateTeamUsersMutation = jest.fn();

    mockUseTeam.mockReturnValue({
      data: team,
    } as Partial<UseQueryResult>);

    mockUseUpdateTeamUsers.mockReturnValue({
      mutate: updateTeamUsersMutation,
    } as Partial<UseMutationResult>);

    const initialState = ({ set }: any) => {
      set(usersListState, users);
    };

    const { mockRouter: teamPageMockRouter } = libraryMocks.mockNextRouter({
      pathname: ROUTES.TeamPage(team.id),
      query: { teamId: team.id },
    });

    const { getByText } = render(
      { isTeamPage: true },
      {
        routerOptions: teamPageMockRouter,
        recoilOptions: { initialState, recoilHandler: jest.fn(), recoilState: usersListState },
      },
    );

    const isNewJoiner = verifyIfIsNewJoiner(users[0].joinedAt, users[0].providerAccountCreatedAt);

    // Assert
    fireEvent.click(getByText('Update'));

    await waitFor(() => {
      expect(updateTeamUsersMutation).toBeCalledWith({
        addUsers: [
          {
            user: users[0]._id,
            role: TeamUserRoles.MEMBER,
            isNewJoiner,
            canBeResponsible: !isNewJoiner,
            team: team.id,
          },
        ],
        removeUsers: [],
        team: team.id,
      });
    });
  });

  it('should update team members list on create team page', async () => {
    // Act
    const user = UserListFactory.create({ isChecked: true });
    const recoilHandler = jest.fn();

    const initialState = ({ set }: any) => {
      set(usersListState, [user]);
    };

    mockUseCurrentSession.mockReturnValue({
      isSAdmin: false,
      userId: user._id,
    } as Partial<UseCurrentSessionResult>);

    const { getByText } = render(
      { isTeamPage: false },
      {
        recoilOptions: { initialState, recoilHandler, recoilState: createTeamState },
      },
    );

    const isNewJoiner = verifyIfIsNewJoiner(user.joinedAt, user.providerAccountCreatedAt);

    // Assert
    fireEvent.click(getByText('Update'));

    await waitFor(() => {
      expect(recoilHandler).toBeCalledWith([
        {
          user,
          role: TeamUserRoles.MEMBER,
          isNewJoiner,
          canBeResponsible: !isNewJoiner,
        },
      ]);
    });
  });
});
