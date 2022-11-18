import { QueryClient, useQueryClient } from 'react-query';
import { NextRouter, useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { SetterOrUpdater, useSetRecoilState } from 'recoil';

import { toastState } from 'store/toast/atom/toast.atom';
import { ToastStateEnum } from '../utils/enums/toast-types';

type TeamUtilsType = {
	userId: string;
	teamId: string | string[] | undefined;
	queryClient: QueryClient;
	setToastState: SetterOrUpdater<{ open: boolean; type: ToastStateEnum; content: string }>;
	router: NextRouter;
};

const useTeamUtils = (): TeamUtilsType => {
	const router = useRouter();
	const { data: session } = useSession({ required: false });

	const queryClient = useQueryClient();

	let userId = '';

	if (session) userId = session.user.id;

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
