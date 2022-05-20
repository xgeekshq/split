import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { toastState } from '../store/toast/atom/toast.atom';

const useBoardUtils = () => {
	const router = useRouter();
	const { data: session } = useSession({ required: false });

	const queryClient = useQueryClient();

	const userId = session?.user.id;

	const setToastState = useSetRecoilState(toastState);

	const boardId = String(router.query.boardId);

	return {
		userId,
		boardId,
		queryClient,
		setToastState,
		router
	};
};

export default useBoardUtils;
