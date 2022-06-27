import { useMutation } from 'react-query';
import { useSession } from 'next-auth/react';

import { addVoteRequest, deleteVoteRequest } from 'api/boardService';
import { ToastStateEnum } from 'utils/enums/toast-types';
import isEmpty from 'utils/isEmpty';
import { getRemainingVotes } from '../utils/getRemainingVotes';
import useBoardUtils from './useBoardUtils';

const useVotes = () => {
	const { queryClient, setToastState } = useBoardUtils();
	const { data: session } = useSession({ required: true });
	const userId = session?.user?.id;

	const addVote = useMutation(addVoteRequest, {
		onSuccess: (data) => {
			queryClient.invalidateQueries(['board', { id: data?._id }]);

			if (!isEmpty(data.maxVotes)) {
				setToastState({
					open: true,
					content: `You have ${getRemainingVotes(data, userId!)} votes left`,
					type: ToastStateEnum.INFO
				});
			}
		},
		onError: () => {
			setToastState({
				open: true,
				content: 'Error adding the vote',
				type: ToastStateEnum.ERROR
			});
		}
	});

	const deleteVote = useMutation(deleteVoteRequest, {
		onSuccess: (data) => {
			queryClient.invalidateQueries(['board', { id: data?._id }]);

			if (!isEmpty(data.maxVotes)) {
				setToastState({
					open: true,
					content: `Vote removed. You have ${getRemainingVotes(
						data,
						userId!
					)} votes left.`,
					type: ToastStateEnum.INFO
				});
			}
		},
		onError: () => {
			setToastState({
				open: true,
				content: 'Error deleting the vote',
				type: ToastStateEnum.ERROR
			});
		}
	});

	return {
		addVote,
		deleteVote
	};
};

export default useVotes;
