import { renderHook, waitFor } from '@testing-library/react';

import { deleteTeamUser } from '@/api/teamService';
import useDeleteTeamUser from '@/hooks/teams/useDeleteTeamUser';
import { toastState } from '@/store/toast/atom/toast.atom';
import { TeamUser } from '@/types/team/team.user';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { TeamUserFactory } from '@/utils/factories/user';
import {
  renderHookWithProviders,
  RenderHookWithProvidersOptions,
} from '@/utils/testing/renderHookWithProviders';

const DUMMY_TEAMUSER = TeamUserFactory.create();

const mockDeleteTeamUser = deleteTeamUser as jest.Mock<Promise<TeamUser>>;
jest.mock('@/api/teamService');

const render = (userId: string, options?: Partial<RenderHookWithProvidersOptions>) =>
  renderHook(() => useDeleteTeamUser(userId), { wrapper: renderHookWithProviders(options) });

describe('Hooks/Teams/useDeleteTeamUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a team user', async () => {
    // Arrange
    const userId = DUMMY_TEAMUSER.user._id;
    mockDeleteTeamUser.mockReturnValueOnce(Promise.resolve(DUMMY_TEAMUSER));

    const recoilHandler = jest.fn();

    const { result } = render(userId, {
      recoilOptions: { recoilState: toastState, recoilHandler },
    });

    result.current.mutate(DUMMY_TEAMUSER);

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(mockDeleteTeamUser).toBeCalledWith(DUMMY_TEAMUSER);
    expect(recoilHandler).toHaveBeenCalledWith({
      open: true,
      content: 'The user was successfully removed from the team.',
      type: ToastStateEnum.SUCCESS,
    });
  });

  it('should set toast error', async () => {
    // Arrange
    const userId = DUMMY_TEAMUSER.user._id;
    mockDeleteTeamUser.mockImplementationOnce(() => {
      throw new Error('Failed to delete team user');
    });
    const recoilHandler = jest.fn();

    // Act
    const { result } = render(userId, {
      recoilOptions: { recoilState: toastState, recoilHandler },
    });

    result.current.mutate(DUMMY_TEAMUSER);

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBeTruthy();
      expect(result.current.data).not.toBeDefined();
      expect(recoilHandler).toHaveBeenCalledWith({
        open: true,
        content: 'Error removing user from the team.',
        type: ToastStateEnum.ERROR,
      });
    });
  });
});
