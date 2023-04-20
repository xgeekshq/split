// TODO: Test if Members & Team Admins <<Avatar Group>> is in the Document

import { UseMutationResult } from '@tanstack/react-query';
import { fireEvent, waitFor } from '@testing-library/dom';

import TeamItem, { TeamItemProps } from '@/components/Teams/TeamsList/TeamItem/TeamItem';
import { TeamUserRoles } from '@/enums/teams/userRoles';
import { TeamFactory } from '@/utils/factories/team';
import { TeamUserFactory } from '@/utils/factories/user';
import { libraryMocks } from '@/utils/testing/mocks';
import {
  renderWithProviders,
  RenderWithProvidersOptions,
} from '@/utils/testing/renderWithProviders';
import useDeleteTeam from '@hooks/teams/useDeleteTeam';
import useDeleteTeamUser from '@hooks/teams/useDeleteTeamUser';
import useUpdateTeamUser from '@hooks/teams/useUpdateTeamUser';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const render = (
  props: Partial<TeamItemProps> = {},
  options?: Partial<RenderWithProvidersOptions>,
) => {
  const team = TeamFactory.create();
  return renderWithProviders(
    <TeamItem isSAdmin={false} team={team} userId={team.users[0]._id!} {...props} />,
    {
      routerOptions: mockRouter,
      ...options,
    },
  );
};

const mockUseDeleteTeam = useDeleteTeam as jest.Mock<Partial<UseMutationResult>>;
const mockUseDeleteTeamUser = useDeleteTeamUser as jest.Mock<Partial<UseMutationResult>>;
const mockUseUpdateTeamUser = useUpdateTeamUser as jest.Mock<Partial<UseMutationResult>>;

jest.mock('@/hooks/teams/useDeleteTeam');
jest.mock('@/hooks/teams/useDeleteTeamUser');
jest.mock('@/hooks/teams/useUpdateTeamUser');

describe('Components/Teams/TeamsList/TeamItem', () => {
  beforeEach(() => {
    mockUseDeleteTeam.mockReturnValue({
      mutate: jest.fn(),
    } as Partial<UseMutationResult>);

    mockUseDeleteTeamUser.mockReturnValue({
      mutate: jest.fn(),
    } as Partial<UseMutationResult>);

    mockUseUpdateTeamUser.mockReturnValue({
      mutate: jest.fn(),
    } as Partial<UseMutationResult>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    // Arrange
    const team = TeamFactory.create();

    // Act
    const { getByText } = render({ team });

    // Assert
    expect(getByText(team.name)).toBeInTheDocument();
  });

  it('should render the amount of team boards', () => {
    // Arrange
    const team = TeamFactory.create({ boardsCount: 3 });

    // Act
    const { getByText } = render({ team });

    // Assert
    expect(getByText('3 team boards')).toBeInTheDocument();
  });

  it('should render no team boards', () => {
    // Arrange
    const team = TeamFactory.create({ boardsCount: 0 });

    // Act
    const { getByText } = render({ team });

    // Assert
    expect(getByText('No boards')).toBeInTheDocument();
  });

  it('should render create first board', () => {
    // Arrange
    const teamAdmin = TeamUserFactory.create({ role: TeamUserRoles.ADMIN });
    const team = TeamFactory.create({
      users: [teamAdmin],
      boardsCount: 0,
    });

    // Act
    const { getByText } = render({ team, userId: teamAdmin.user._id });

    // Assert
    expect(getByText('Create first board')).toBeInTheDocument();
  });

  it('should delete the team', async () => {
    // Arrange
    const deleteTeamMutation = jest.fn();

    mockUseDeleteTeam.mockReturnValue({
      mutate: deleteTeamMutation,
    } as Partial<UseMutationResult>);

    const teamAdmin = TeamUserFactory.create({ role: TeamUserRoles.ADMIN });
    const team = TeamFactory.create({
      users: [teamAdmin],
    });

    // Act
    const { getByTestId, getByText } = render({ team, userId: teamAdmin.user._id });

    fireEvent.click(getByTestId('deleteTeamButton'));
    fireEvent.click(getByText('Delete'));

    // Assert
    await waitFor(() => {
      expect(deleteTeamMutation).toBeCalledWith(team.id);
    });
  });

  it('should remove the user from the team', async () => {
    // Arrange
    const teamMember = TeamUserFactory.create({ role: TeamUserRoles.MEMBER });
    const team = TeamFactory.create({
      users: [teamMember],
    });

    const { mockRouter } = libraryMocks.mockNextRouter({
      pathname: `/users/${teamMember.user._id}`,
      query: { userId: teamMember.user._id },
    });

    const deleteTeamUserMutation = jest.fn();

    mockUseDeleteTeamUser.mockReturnValue({
      mutate: deleteTeamUserMutation,
    } as Partial<UseMutationResult>);

    // Act
    const { getByTestId, getByText } = render(
      { team, isSAdmin: true },
      { routerOptions: mockRouter },
    );

    fireEvent.click(getByTestId('deleteTeamButton'));
    fireEvent.click(getByText('Remove'));

    // Assert
    await waitFor(() => {
      expect(deleteTeamUserMutation).toBeCalledWith(teamMember);
    });
  });

  it('should change team user role on user teams page', async () => {
    // Arrange
    const teamMember = TeamUserFactory.create({ role: TeamUserRoles.MEMBER });
    const team = TeamFactory.create({
      users: [teamMember],
    });

    const { mockRouter } = libraryMocks.mockNextRouter({
      pathname: `/users/${teamMember.user._id}`,
      query: { userId: teamMember.user._id },
    });

    const updateamUserMutation = jest.fn();

    mockUseUpdateTeamUser.mockReturnValue({
      mutate: updateamUserMutation,
    } as Partial<UseMutationResult>);

    // Act
    const { getByTestId } = render({ team, isSAdmin: true }, { routerOptions: mockRouter });

    fireEvent.click(getByTestId('teamRolePopoverTrigger'));
    fireEvent.click(getByTestId('teamStakeholderPopover'));

    // Assert
    await waitFor(() => {
      expect(updateamUserMutation).toBeCalledWith({
        ...teamMember,
        user: teamMember.user._id,
        role: TeamUserRoles.STAKEHOLDER,
      });
    });
  });
});
