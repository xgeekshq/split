import { renderHook, waitFor } from '@testing-library/react';

import { updateAddTeamsToUser } from '@/api/teamService';
import { createErrorMessage, createSuccessMessage } from '@/constants/toasts';
import { ErrorMessages, SuccessMessages } from '@/constants/toasts/teams-messages';
import useUpdateUserTeams from '@/hooks/teams/useUpdateUserTeams';
import { toastState } from '@/store/toast/atom/toast.atom';
import { TeamUserUpdate } from '@/types/team/team.user';
import { CreateTeamUserFactory } from '@/utils/factories/user';
import {
  renderHookWithProviders,
  RenderHookWithProvidersOptions,
} from '@/utils/testing/renderHookWithProviders';

const DUMMY_TEAMUSER_UPDATE = CreateTeamUserFactory.create() as TeamUserUpdate;

const mockUpdateUserTeams = updateAddTeamsToUser as jest.Mock<Promise<TeamUserUpdate>>;
jest.mock('@/api/teamService');

const render = (userId: string, options?: Partial<RenderHookWithProvidersOptions>) =>
  renderHook(() => useUpdateUserTeams(userId), {
    wrapper: renderHookWithProviders(options),
  });

describe('Hooks/Teams/useUpdateUserTeams', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update team users', async () => {
    // Arrange
    const userId = DUMMY_TEAMUSER_UPDATE.user as string;
    mockUpdateUserTeams.mockReturnValueOnce(Promise.resolve(DUMMY_TEAMUSER_UPDATE));

    const recoilHandler = jest.fn();

    const { result } = render(userId, {
      recoilOptions: { recoilState: toastState, recoilHandler },
    });

    result.current.mutate([DUMMY_TEAMUSER_UPDATE]);

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(mockUpdateUserTeams).toBeCalledWith([DUMMY_TEAMUSER_UPDATE]);
    expect(recoilHandler).toHaveBeenCalledWith(createSuccessMessage(SuccessMessages.UPDATE_TEAM));
  });

  it('should set toast error', async () => {
    // Arrange
    const userId = DUMMY_TEAMUSER_UPDATE.user as string;
    mockUpdateUserTeams.mockImplementationOnce(() => {
      throw new Error('Failed to update user teams');
    });
    const recoilHandler = jest.fn();

    // Act
    const { result } = render(userId, {
      recoilOptions: { recoilState: toastState, recoilHandler },
    });

    result.current.mutate([DUMMY_TEAMUSER_UPDATE]);

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBeTruthy();
      expect(result.current.data).not.toBeDefined();
      expect(recoilHandler).toHaveBeenCalledWith(createErrorMessage(ErrorMessages.UPDATE_TEAM));
    });
  });
});
