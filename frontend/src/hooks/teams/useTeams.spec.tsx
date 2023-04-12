import { renderHook, waitFor } from '@testing-library/react';
import {
  RenderHookWithProvidersOptions,
  renderHookWithProviders,
} from '@/utils/testing/renderHookWithProviders';
import { TeamFactory } from '@/utils/factories/team';
import { getAllTeams, getUserTeams } from '@/api/teamService';
import { Team } from '@/types/team/team';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { toastState } from '@/store/toast/atom/toast.atom';
import useTeams from './useTeams';

const DUMMY_TEAMS = TeamFactory.createMany(3);

const mockGetAllTeams = getAllTeams as jest.Mock<Promise<Team[]>>;
const mockGetUserTeams = getUserTeams as jest.Mock<Promise<Team[]>>;

jest.mock('@/api/teamService');

const render = (isSAdmin: boolean, options?: Partial<RenderHookWithProvidersOptions>) =>
  renderHook(() => useTeams(isSAdmin), { wrapper: renderHookWithProviders(options) });

describe('Hooks/Teams/useTeams', () => {
  beforeEach(() => {
    mockGetAllTeams.mockReturnValue(Promise.resolve(DUMMY_TEAMS));
    mockGetUserTeams.mockReturnValue(Promise.resolve(DUMMY_TEAMS));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all the teams as Super Admin', async () => {
    const { result } = render(true);

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(mockGetAllTeams).toBeCalled();
    expect(mockGetUserTeams).not.toBeCalled();
    expect(result.current.data).toBe(DUMMY_TEAMS);
  });

  it('should fetch user the teams', async () => {
    const { result } = render(false);

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(mockGetUserTeams).toBeCalled();
    expect(mockGetAllTeams).not.toBeCalled();
    expect(result.current.data).toBe(DUMMY_TEAMS);
  });

  it('should set toast error', async () => {
    mockGetAllTeams.mockReturnValue(Promise.reject(new Error('Failed to fetch teams')));
    const recoilHandler = jest.fn();

    // Act
    const { result } = render(true, { recoilOptions: { recoilState: toastState, recoilHandler } });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBeTruthy();
      expect(result.current.data).not.toBeDefined();
      expect(recoilHandler).toHaveBeenCalledWith({
        open: true,
        content: 'Error getting the teams',
        type: ToastStateEnum.ERROR,
      });
    });
  });
});
