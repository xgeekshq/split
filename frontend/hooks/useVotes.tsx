import { useMutation } from 'react-query';
import { addVoteRequest, deleteVoteRequest } from '../api/boardService';
import { ToastStateEnum } from '../utils/enums/toast-types';
import useBoardUtils from './useBoardUtils';

const useVotes = () => {
	const { queryClient, setToastState } = useBoardUtils();

	const addVote = useMutation(addVoteRequest, {
		onSuccess: (data) => {
			queryClient.invalidateQueries(['board', { id: data?._id }]);
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
