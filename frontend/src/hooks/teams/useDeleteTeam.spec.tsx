import { renderHook, waitFor } from '@testing-library/react';

import { deleteTeam } from '@/api/teamService';
import { createErrorMessage, createSuccessMessage } from '@/constants/toasts';
import { ErrorMessages, SuccessMessages } from '@/constants/toasts/teams-messages';
import useDeleteTeam from '@/hooks/teams/useDeleteTeam';
import { toastState } from '@/store/toast/atom/toast.atom';
import { Team } from '@/types/team/team';
import { TeamFactory } from '@/utils/factories/team';
import {
  renderHookWithProviders,
  RenderHookWithProvidersOptions,
} from '@/utils/testing/renderHookWithProviders';

const DUMMY_TEAM = TeamFactory.create();

const mockDeleteTeam = deleteTeam as jest.Mock<Promise<Team>>;
jest.mock('@/api/teamService');

const render = (teamId: string, options?: Partial<RenderHookWithProvidersOptions>) =>
  renderHook(() => useDeleteTeam(teamId), { wrapper: renderHookWithProviders(options) });

describe('Hooks/Teams/useDeleteTeam', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a team', async () => {
    // Arrange
    const teamId = DUMMY_TEAM.id;
    mockDeleteTeam.mockReturnValueOnce(Promise.resolve(DUMMY_TEAM));

    const recoilHandler = jest.fn();

    const { result } = render(teamId, {
      recoilOptions: { recoilState: toastState, recoilHandler },
    });

    result.current.mutate(teamId);

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(mockDeleteTeam).toBeCalledWith(teamId);
    expect(recoilHandler).toHaveBeenCalledWith(createSuccessMessage(SuccessMessages.DELETE));
  });

  it('should set toast error', async () => {
    // Arrange
    const teamId = DUMMY_TEAM.id;
    mockDeleteTeam.mockImplementationOnce(() => {
      throw new Error('Failed to delete team');
    });
    const recoilHandler = jest.fn();

    // Act
    const { result } = render(teamId, {
      recoilOptions: { recoilState: toastState, recoilHandler },
    });

    result.current.mutate(teamId);

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBeTruthy();
      expect(result.current.data).not.toBeDefined();
      expect(recoilHandler).toHaveBeenCalledWith(createErrorMessage(ErrorMessages.DELETE));
    });
  });
});
