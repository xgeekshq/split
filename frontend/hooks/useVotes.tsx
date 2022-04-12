import { useMutation } from "react-query";
import { addVoteRequest, deleteVoteRequest } from "../api/boardService";

const useVotes = () => {
  const addVote = useMutation(addVoteRequest, {
    onSuccess: () => {},
    onError: () => {},
  });

  const deleteVote = useMutation(deleteVoteRequest, {
    onSuccess: () => {},
    onError: () => {},
  });

  return {
    addVote,
    deleteVote,
  };
};

export default useVotes;
