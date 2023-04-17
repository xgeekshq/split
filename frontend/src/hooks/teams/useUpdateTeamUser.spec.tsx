import { renderHook, waitFor } from '@testing-library/react';

import { updateTeamUser } from '@/api/teamService';
import useUpdateTeamUser from '@/hooks/teams/useUpdateTeamUser';
import { toastState } from '@/store/toast/atom/toast.atom';
import { TeamUserUpdate } from '@/types/team/team.user';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { TeamUserFactory } from '@/utils/factories/user';
import {
  renderHookWithProviders,
  RenderHookWithProvidersOptions,
} from '@/utils/testing/renderHookWithProviders';

const DUMMY_TEAMUSER = TeamUserFactory.create();
const DUMMY_TEAMUSER_UPDATE = {
  role: DUMMY_TEAMUSER.role,
  canBeResponsible: DUMMY_TEAMUSER.canBeResponsible,
  isNewJoiner: DUMMY_TEAMUSER.isNewJoiner,
  team: DUMMY_TEAMUSER.team,
  user: DUMMY_TEAMUSER.user._id,
} as TeamUserUpdate;

const mockUpdateTeamUser = updateTeamUser as jest.Mock<Promise<TeamUserUpdate>>;
jest.mock('@/api/teamService');

const render = (
  teamId: string,
  userId: string,
  options?: Partial<RenderHookWithProvidersOptions>,
) =>
  renderHook(() => useUpdateTeamUser(teamId, userId), {
    wrapper: renderHookWithProviders(options),
  });

describe('Hooks/Teams/useUpdateTeamUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a team user', async () => {
    // Arrange
    const teamId = DUMMY_TEAMUSER.team as string;
    const userId = DUMMY_TEAMUSER.user._id;
    mockUpdateTeamUser.mockReturnValueOnce(Promise.resolve(DUMMY_TEAMUSER_UPDATE));

    const recoilHandler = jest.fn();

    const { result } = render(teamId, userId, {
      recoilOptions: { recoilState: toastState, recoilHandler },
    });

    result.current.mutate(DUMMY_TEAMUSER_UPDATE);

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(mockUpdateTeamUser).toBeCalledWith(DUMMY_TEAMUSER_UPDATE);
    expect(recoilHandler).toHaveBeenCalledWith({
      open: true,
      content: 'The team user was successfully updated.',
      type: ToastStateEnum.SUCCESS,
    });
  });

  it('should set toast error', async () => {
    // Arrange
    const teamId = DUMMY_TEAMUSER.team as string;
    const userId = DUMMY_TEAMUSER.user._id;
    mockUpdateTeamUser.mockImplementationOnce(() => {
      throw new Error('Failed to update team user');
    });
    const recoilHandler = jest.fn();

    // Act
    const { result } = render(teamId, userId, {
      recoilOptions: { recoilState: toastState, recoilHandler },
    });

    result.current.mutate(DUMMY_TEAMUSER_UPDATE);

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBeTruthy();
      expect(result.current.data).not.toBeDefined();
      expect(recoilHandler).toHaveBeenCalledWith({
        open: true,
        content: 'Error while updating the team user',
        type: ToastStateEnum.ERROR,
      });
    });
  });
});
