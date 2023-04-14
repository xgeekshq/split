import { renderHook, waitFor } from '@testing-library/react';
import {
  RenderHookWithProvidersOptions,
  renderHookWithProviders,
} from '@/utils/testing/renderHookWithProviders';
import { createTeamRequest } from '@/api/teamService';
import { Team } from '@/types/team/team';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { toastState } from '@/store/toast/atom/toast.atom';
import useCreateTeam from '@/hooks/teams/useCreateTeam';
import { TeamFactory, CreateTeamFactory } from '@/utils/factories/team';

const DUMMY_TEAM = TeamFactory.create();

const mockCreateTeam = createTeamRequest as jest.Mock<Promise<Team>>;
jest.mock('@/api/teamService');

const render = (options?: Partial<RenderHookWithProvidersOptions>) =>
  renderHook(() => useCreateTeam(), { wrapper: renderHookWithProviders(options) });

describe('Hooks/Teams/useCreateTeam', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new team', async () => {
    // Arrange
    mockCreateTeam.mockReturnValueOnce(Promise.resolve(DUMMY_TEAM));

    const recoilHandler = jest.fn();

    const { result } = render({
      recoilOptions: { recoilState: toastState, recoilHandler },
    });

    const teamToCreate = CreateTeamFactory.create();
    result.current.mutate(teamToCreate);

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

    expect(mockCreateTeam).toBeCalledWith(teamToCreate);
    expect(recoilHandler).toHaveBeenCalledWith({
      open: true,
      content: 'The team was successfully created.',
      type: ToastStateEnum.SUCCESS,
    });
  });

  it('should set toast error', async () => {
    mockCreateTeam.mockImplementationOnce(() => {
      throw new Error('Failed to create team');
    });
    const recoilHandler = jest.fn();

    // Act
    const { result } = render({
      recoilOptions: { recoilState: toastState, recoilHandler },
    });

    const teamToCreate = CreateTeamFactory.create();
    result.current.mutate(teamToCreate);

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBeTruthy();
      expect(result.current.data).not.toBeDefined();
      expect(recoilHandler).toHaveBeenCalledWith({
        open: true,
        content: 'Error creating the team',
        type: ToastStateEnum.ERROR,
      });
    });
  });
});
