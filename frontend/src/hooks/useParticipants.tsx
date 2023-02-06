/* eslint-disable @typescript-eslint/no-unused-vars */
import { ToastStateEnum } from '@/utils/enums/toast-types';
import useBoardUtils from './useBoardUtils';

const useParticipants = () => {
  const { boardId, queryClient, setToastState } = useBoardUtils();

  //   const getBoardQuery = (id: string | undefined) => ['board', { id }];

  //   const getPrevData = async (id: string | undefined): Promise<BoardType | undefined> => {
  //     const query = getBoardQuery(id);
  //     await queryClient.cancelQueries(query);
  //     const prevData = queryClient.getQueryData<{ board: BoardType }>(query);
  //     return prevData?.board;
  //   };

  //   const fetchBoardParticipants = useQuery(
  //     ['participants', { id: boardId }],
  //     () => getBoardParticipantsRequest(boardId),
  //     {
  //       enabled: false,
  //       refetchOnWindowFocus: true,
  //       onError: () => {
  //         queryClient.invalidateQueries(['board', { id: boardId }]);
  //         setToastState({
  //           open: true,
  //           content: 'Error getting the board',
  //           type: ToastStateEnum.ERROR,
  //         });
  //       },
  //     },
  //   );

  //   const updateParticipants = useMutation(updateColumnRequest, {
  //     onMutate: async (data) => {
  //       const prevBoard = await getPrevData(data.boardId);

  //       if (prevBoard) {
  //         const columnsWithUpdate = prevBoard.columns.map((column) =>
  //           column._id === data._id
  //             ? {
  //                 ...data,
  //               }
  //             : column,
  //         );

  //         updateBoardColumns(data.boardId, columnsWithUpdate);
  //       }

  //       return { previousBoard: prevBoard, data };
  //     },
  //     onSuccess: async (data) => {
  //       const prevBoard = await getPrevData(data._id);

  //       return { previousBoard: prevBoard, data };
  //     },
  //     onError: (_, variables) => {
  //       queryClient.invalidateQueries(getBoardQuery(variables.boardId));
  //       setToastState({
  //         open: true,
  //         content: 'Error updating the column',
  //         type: ToastStateEnum.ERROR,
  //       });
  //     },
  //   });

  //   return {
  //     fetchBoardParticipants,
  //   };
};

export default useParticipants;
