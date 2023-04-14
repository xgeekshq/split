import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { toastState } from '@/store/toast/atom/toast.atom';
import { usersListState } from '@/store/user.atom';

const useBoardUtils = () => {
  const router = useRouter();
  const { data: session } = useSession({ required: false });

  const queryClient = useQueryClient();

  const setToastState = useSetRecoilState(toastState);

  const boardId = String(router.query.boardId);

  const usersList = useRecoilValue(usersListState);

  return {
    boardId,
    queryClient,
    setToastState,
    router,
    usersList,
    session,
  };
};

export default useBoardUtils;
