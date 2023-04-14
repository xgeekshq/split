import { renderHook, waitFor } from '@testing-library/react';
import {
  RenderHookWithProvidersOptions,
  renderHookWithProviders,
} from '@/utils/testing/renderHookWithProviders';
import { deleteTeam } from '@/api/teamService';
import { Team } from '@/types/team/team';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { toastState } from '@/store/toast/atom/toast.atom';
import { TeamFactory } from '@/utils/factories/team';
import useDeleteTeam from '@/hooks/teams/useDeleteTeam';

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
    expect(recoilHandler).toHaveBeenCalledWith({
      open: true,
      content: 'The team was successfully deleted.',
      type: ToastStateEnum.SUCCESS,
    });
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
      expect(recoilHandler).toHaveBeenCalledWith({
        open: true,
        content: 'Error deleting the team.',
        type: ToastStateEnum.ERROR,
      });
    });
  });
});
