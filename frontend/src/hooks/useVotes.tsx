import { useMutation } from 'react-query';

import { handleVotes } from 'api/boardService';
import { ToastStateEnum } from 'utils/enums/toast-types';
import useBoardUtils from './useBoardUtils';

const useVotes = () => {
	const { queryClient, setToastState } = useBoardUtils();

	const handleVote = useMutation(handleVotes, {
		onSuccess: (voteData) => {
			queryClient.invalidateQueries(['board', { id: voteData?._id }]);
		},
		onError: (error, variables) => {
			queryClient.invalidateQueries(['board', { id: variables.boardId }]);
			setToastState({
				open: true,
				content: 'Error adding the vote',
				type: ToastStateEnum.ERROR
			});
		}
	});

	return {
		handleVote
	};
};

export default useVotes;
