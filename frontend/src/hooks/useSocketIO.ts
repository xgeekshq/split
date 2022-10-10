import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { io, Socket } from 'socket.io-client';

import { NEXT_PUBLIC_BACKEND_URL } from 'utils/constants';

export const useSocketIO = (boardId: string): string | undefined => {
	const queryClient = useQueryClient();
	const [socket, setSocket] = useState<Socket | null>(null);

	//console.log('socket', boardId, queryClient, setSocket)
	useEffect(() => {
		const newSocket: Socket = io(NEXT_PUBLIC_BACKEND_URL ?? 'http://127.0.0.1:3200', {
			transports: ['polling']
		});

		//console.log('newsocket', newSocket)

		newSocket.on('connect', () => {
			newSocket.emit('join', { boardId });
			setSocket(newSocket);
		});

		newSocket.on('updateAllBoard', () => {
			console.log('ali', queryClient.invalidateQueries(['board', { id: boardId }]));
			queryClient.invalidateQueries(['board', { id: boardId }]);
			
		});

		newSocket.on('updateBoardList', () => {
			queryClient.invalidateQueries('boards');
			console.log('Esta aqui', queryClient.invalidateQueries('boards'));
		});

		return () => {
			newSocket.disconnect();
			setSocket(null);
		};
	}, [boardId, queryClient, setSocket]);

	return socket?.id;
};
