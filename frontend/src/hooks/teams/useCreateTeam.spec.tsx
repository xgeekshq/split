import { renderHook, waitFor } from '@testing-library/react';

import { createTeamRequest } from '@/api/teamService';
import { createErrorMessage, createSuccessMessage } from '@/constants/toasts';
import { ErrorMessages, SuccessMessages } from '@/constants/toasts/teams-messages';
import useCreateTeam from '@/hooks/teams/useCreateTeam';
import { toastState } from '@/store/toast/atom/toast.atom';
import { Team } from '@/types/team/team';
import { CreateTeamFactory, TeamFactory } from '@/utils/factories/team';
import {
  renderHookWithProviders,
  RenderHookWithProvidersOptions,
} from '@/utils/testing/renderHookWithProviders';

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
    expect(recoilHandler).toHaveBeenCalledWith(createSuccessMessage(SuccessMessages.CREATE));
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
      expect(recoilHandler).toHaveBeenCalledWith(createErrorMessage(ErrorMessages.CREATE));
    });
  });
});
