import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { toastState } from '@/store/toast/atom/toast.atom';
import { usersListState } from '@/store/team/atom/team.atom';

import { getGuestUserCookies } from './useUser';

const useBoardUtils = () => {
  const router = useRouter();
  const { data: session } = useSession({ required: false });

  const queryClient = useQueryClient();

  const guestUserCookie = getGuestUserCookies();

  const userId = !session && guestUserCookie ? guestUserCookie[0].user : undefined;

  const setToastState = useSetRecoilState(toastState);

  const boardId = String(router.query.boardId);

  const usersList = useRecoilValue(usersListState);

  return {
    userId,
    boardId,
    queryClient,
    setToastState,
    router,
    usersList,
    session,
  };
};

export default useBoardUtils;
