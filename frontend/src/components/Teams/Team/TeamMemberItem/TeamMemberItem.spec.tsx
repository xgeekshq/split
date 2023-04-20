import React from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { fireEvent, waitFor } from '@testing-library/dom';

import TeamMemberItem, {
  TeamMemberItemProps,
} from '@/components/Teams/Team/TeamMemberItem/TeamMemberItem';
import { createTeamState } from '@/store/team.atom';
import { TeamUserFactory, UserFactory } from '@/utils/factories/user';
import { getFormattedUsername } from '@/utils/getFormattedUsername';
import { libraryMocks } from '@/utils/testing/mocks';
import {
  renderWithProviders,
  RenderWithProvidersOptions,
} from '@/utils/testing/renderWithProviders';
import useUpdateTeamUser from '@hooks/teams/useUpdateTeamUser';
import { TeamUserRoles } from '@utils/enums/team.user.roles';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });
const mockUser = UserFactory.create();

const render = (
  props: Partial<TeamMemberItemProps> = {},
  options?: Partial<RenderWithProvidersOptions>,
) =>
  renderWithProviders(<TeamMemberItem isTeamPage member={TeamUserFactory.create()} {...props} />, {
    routerOptions: mockRouter,
    sessionOptions: { user: mockUser },
    ...options,
  });

const mockUseUpdateTeamUser = useUpdateTeamUser as jest.Mock<Partial<UseMutationResult>>;
jest.mock('@/hooks/teams/useUpdateTeamUser');

describe('Components/Teams/Team/TeamMemberItem', () => {
  beforeEach(() => {
    mockUseUpdateTeamUser.mockReturnValue({
      mutate: jest.fn(),
    } as Partial<UseMutationResult>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    // Arrange
    const member = TeamUserFactory.create();

    // Act
    const { getByText, getByTestId } = render({ member });

    // Assert
    expect(
      getByText(getFormattedUsername(member.user.firstName, member.user.lastName)),
    ).toBeInTheDocument();
    expect(getByTestId('roleSelector')).toBeInTheDocument();
  });

  it('should allow to change new joiner status', () => {
    // Act
    const { getByTestId } = render({ hasPermissions: true });

    // Assert
    expect(getByTestId('boardRolePopover')).toBeInTheDocument();
  });

  it('should not allow to change new joiner status', () => {
    // Act
    const { getByTestId } = render({
      member: TeamUserFactory.create({ isNewJoiner: true }),
      hasPermissions: false,
    });

    // Assert
    expect(getByTestId('newJoinerTooltip')).toBeInTheDocument();
  });

  it('should update team user role on team page', async () => {
    // Arrange
    const teamUser = TeamUserFactory.create({ role: TeamUserRoles.MEMBER });
    const updateTeamUserMutation = jest.fn();

    mockUseUpdateTeamUser.mockReturnValue({
      mutate: updateTeamUserMutation,
    } as Partial<UseMutationResult>);

    const { getByTestId } = render({
      member: teamUser,
      hasPermissions: true,
    });

    // Act
    const trigger = getByTestId('teamRolePopoverTrigger');
    if (trigger) fireEvent.click(trigger);

    fireEvent.click(getByTestId('teamAdminPopover'));

    // Assert
    await waitFor(() => {
      expect(updateTeamUserMutation).toBeCalledWith({
        ...teamUser,
        role: TeamUserRoles.ADMIN,
        user: teamUser.user._id,
      });
    });
  });

  it('should update team user role on create team page', async () => {
    // Arrange
    const teamUser = TeamUserFactory.create({ role: TeamUserRoles.MEMBER });
    const recoilHandler = jest.fn();

    const { getByTestId } = render(
      {
        isTeamPage: false,
        member: teamUser,
        hasPermissions: true,
      },
      {
        recoilOptions: { recoilState: createTeamState, recoilHandler },
      },
    );

    // Act
    const trigger = getByTestId('teamRolePopoverTrigger');
    if (trigger) fireEvent.click(trigger);

    fireEvent.click(getByTestId('teamAdminPopover'));

    // Assert
    await waitFor(() => {
      expect(recoilHandler).toBeCalled();
    });
  });

  it('should update team user isNewJoiner status on team page', async () => {
    // Arrange
    const teamUser = TeamUserFactory.create({
      isNewJoiner: true,
      canBeResponsible: false,
      role: TeamUserRoles.MEMBER,
    });
    const updateTeamUserMutation = jest.fn();

    mockUseUpdateTeamUser.mockReturnValue({
      mutate: updateTeamUserMutation,
    } as Partial<UseMutationResult>);

    const { getByTestId, getByText } = render({
      member: teamUser,
      hasPermissions: true,
    });

    // Act
    const trigger = getByTestId('boardRolePopoverTrigger');
    if (trigger) fireEvent.click(trigger);

    const newJoinerSwitch =
      getByText('New Joiner').parentElement?.parentElement?.querySelector('button');

    if (newJoinerSwitch) fireEvent.click(newJoinerSwitch);

    // Assert
    await waitFor(() => {
      expect(updateTeamUserMutation).toBeCalledWith({
        ...teamUser,
        user: teamUser.user._id,
        isNewJoiner: !teamUser.isNewJoiner,
        canBeResponsible: !teamUser.canBeResponsible,
      });
    });
  });

  it('should update team user isNewJoiner status on create team page', async () => {
    // Arrange
    const teamUser = TeamUserFactory.create({
      isNewJoiner: true,
      canBeResponsible: false,
      role: TeamUserRoles.MEMBER,
    });
    const recoilHandler = jest.fn();

    const { getByTestId, getByText } = render(
      {
        isTeamPage: false,
        member: teamUser,
        hasPermissions: true,
      },
      {
        recoilOptions: { recoilState: createTeamState, recoilHandler },
      },
    );

    // Act
    const trigger = getByTestId('boardRolePopoverTrigger');
    if (trigger) fireEvent.click(trigger);

    const newJoinerSwitch =
      getByText('New Joiner').parentElement?.parentElement?.querySelector('button');

    if (newJoinerSwitch) fireEvent.click(newJoinerSwitch);

    // Assert
    await waitFor(() => {
      expect(recoilHandler).toBeCalled();
    });
  });

  it('should update team user canBeResponsible status on team page', async () => {
    // Arrange
    const teamUser = TeamUserFactory.create({
      isNewJoiner: false,
      canBeResponsible: true,
      role: TeamUserRoles.MEMBER,
    });
    const updateTeamUserMutation = jest.fn();

    mockUseUpdateTeamUser.mockReturnValue({
      mutate: updateTeamUserMutation,
    } as Partial<UseMutationResult>);

    const { getByTestId, getByText } = render({
      member: teamUser,
      hasPermissions: true,
    });

    // Act
    const trigger = getByTestId('boardRolePopoverTrigger');
    if (trigger) fireEvent.click(trigger);

    const canBeResponsibleSwitch =
      getByText('Responsible allowed').parentElement?.parentElement?.querySelector('button');

    if (canBeResponsibleSwitch) fireEvent.click(canBeResponsibleSwitch);

    // Assert
    await waitFor(() => {
      expect(updateTeamUserMutation).toBeCalledWith({
        ...teamUser,
        user: teamUser.user._id,
        canBeResponsible: !teamUser.canBeResponsible,
      });
    });
  });

  it('should update team user canBeResponsible status on create team page', async () => {
    // Arrange
    const teamUser = TeamUserFactory.create({
      isNewJoiner: false,
      canBeResponsible: true,
      role: TeamUserRoles.MEMBER,
    });
    const recoilHandler = jest.fn();

    const { getByTestId, getByText } = render(
      {
        isTeamPage: false,
        member: teamUser,
        hasPermissions: true,
      },
      {
        recoilOptions: { recoilState: createTeamState, recoilHandler },
      },
    );

    // Act
    const trigger = getByTestId('boardRolePopoverTrigger');
    if (trigger) fireEvent.click(trigger);

    const canBeResponsibleSwitch =
      getByText('Responsible allowed').parentElement?.parentElement?.querySelector('button');

    if (canBeResponsibleSwitch) fireEvent.click(canBeResponsibleSwitch);

    // Assert
    await waitFor(() => {
      expect(recoilHandler).toBeCalled();
    });
  });
});
