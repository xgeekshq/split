import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useSetRecoilState } from 'recoil';

import { toastState } from 'store/toast/atom/toast.atom';

const useTeamUtils = () => {
	const router = useRouter();
	const { data: session } = useSession({ required: false });

	const queryClient = useQueryClient();

	const userId = session?.user.id;

	const setToastState = useSetRecoilState(toastState);

	const { teamId } = router.query;

	return {
		userId,
		teamId,
		queryClient,
		setToastState,
		router
	};
};

export default useTeamUtils;
