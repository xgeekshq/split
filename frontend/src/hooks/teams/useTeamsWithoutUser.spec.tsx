import { renderHook, waitFor } from '@testing-library/react';

import { getTeamsWithoutUser } from '@/api/teamService';
import { ErrorMessages } from '@/constants/toasts/teams-messages';
import useTeamsWithoutUser from '@/hooks/teams/useTeamsWithoutUser';
import { toastState } from '@/store/toast/atom/toast.atom';
import { TeamChecked } from '@/types/team/team';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { TeamCheckedFactory } from '@/utils/factories/team';
import {
  renderHookWithProviders,
  RenderHookWithProvidersOptions,
} from '@/utils/testing/renderHookWithProviders';

const DUMMY_TEAMS = TeamCheckedFactory.createMany(3);

const mockGetTeamsWithoutUser = getTeamsWithoutUser as jest.Mock<Promise<TeamChecked[]>>;

jest.mock('@/api/teamService');

const render = (userId: string, options?: Partial<RenderHookWithProvidersOptions>) =>
  renderHook(() => useTeamsWithoutUser(userId), { wrapper: renderHookWithProviders(options) });

describe('Hooks/Teams/useTeamsWithoutUser', () => {
  beforeEach(() => {
    mockGetTeamsWithoutUser.mockReturnValue(Promise.resolve(DUMMY_TEAMS));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch teams without user', async () => {
    const { result } = render('thisIsTheUserId');

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(mockGetTeamsWithoutUser).toBeCalled();
    expect(result.current.data).toBe(DUMMY_TEAMS);
  });

  it('should set toast error', async () => {
    mockGetTeamsWithoutUser.mockReturnValueOnce(Promise.reject(new Error('Failed to fetch teams')));
    const recoilHandler = jest.fn();

    // Act
    const { result } = render('thisIsTheUserId', {
      recoilOptions: { recoilState: toastState, recoilHandler },
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBeTruthy();
      expect(result.current.data).not.toBeDefined();
      expect(recoilHandler).toHaveBeenCalledWith({
        open: true,
        content: ErrorMessages.GET,
        type: ToastStateEnum.ERROR,
      });
    });
  });
});
