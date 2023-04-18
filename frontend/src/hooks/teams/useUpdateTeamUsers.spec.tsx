import { renderHook, waitFor } from '@testing-library/react';

import { updateTeamUsers } from '@/api/teamService';
import { ErrorMessages, SuccessMessages } from '@/constants/toasts/teams-messages';
import useUpdateTeamUsers from '@/hooks/teams/useUpdateTeamUsers';
import { toastState } from '@/store/toast/atom/toast.atom';
import { CreatedTeamUser } from '@/types/team/team.user';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { CreateTeamUserFactory } from '@/utils/factories/user';
import {
  renderHookWithProviders,
  RenderHookWithProvidersOptions,
} from '@/utils/testing/renderHookWithProviders';

const DUMMY_TEAMUSERS = CreateTeamUserFactory.createMany(3);
const TEAMUSER_ADD_REMOVE = {
  team: DUMMY_TEAMUSERS[0].team as string,
  addUsers: DUMMY_TEAMUSERS,
  removeUsers: DUMMY_TEAMUSERS.map((tu) => tu._id),
};

const mockUpdateTeamUsers = updateTeamUsers as jest.Mock<Promise<CreatedTeamUser[]>>;
jest.mock('@/api/teamService');

const render = (teamId: string, options?: Partial<RenderHookWithProvidersOptions>) =>
  renderHook(() => useUpdateTeamUsers(teamId), {
    wrapper: renderHookWithProviders(options),
  });

describe('Hooks/Teams/useUpdateTeamUsers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update team users', async () => {
    // Arrange
    const teamId = TEAMUSER_ADD_REMOVE.team;
    mockUpdateTeamUsers.mockReturnValueOnce(Promise.resolve(DUMMY_TEAMUSERS));

    const recoilHandler = jest.fn();

    const { result } = render(teamId, {
      recoilOptions: { recoilState: toastState, recoilHandler },
    });

    result.current.mutate(TEAMUSER_ADD_REMOVE);

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(mockUpdateTeamUsers).toBeCalledWith(TEAMUSER_ADD_REMOVE);
    expect(recoilHandler).toHaveBeenCalledWith({
      open: true,
      content: SuccessMessages.UPDATE,
      type: ToastStateEnum.SUCCESS,
    });
  });

  it('should set toast error', async () => {
    // Arrange
    const teamId = TEAMUSER_ADD_REMOVE.team;
    mockUpdateTeamUsers.mockImplementationOnce(() => {
      throw new Error('Failed to update team user');
    });
    const recoilHandler = jest.fn();

    // Act
    const { result } = render(teamId, {
      recoilOptions: { recoilState: toastState, recoilHandler },
    });

    result.current.mutate(TEAMUSER_ADD_REMOVE);

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBeTruthy();
      expect(result.current.data).not.toBeDefined();
      expect(recoilHandler).toHaveBeenCalledWith({
        open: true,
        content: ErrorMessages.UPDATE,
        type: ToastStateEnum.ERROR,
      });
    });
  });
});
