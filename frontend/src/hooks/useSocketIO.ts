import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { io, Socket } from 'socket.io-client';

import { NEXT_PUBLIC_BACKEND_URL } from 'utils/constants';

export const useSocketIO = (boardId: string): string | undefined => {
	const queryClient = useQueryClient();
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const newSocket: Socket = io(NEXT_PUBLIC_BACKEND_URL ?? 'http://127.0.0.1:3200', {
			transports: ['polling']
		});

		newSocket.on('connect', () => {
			newSocket.emit('join', { boardId });
			setSocket(newSocket);
		});

		newSocket.on('updateAllBoard', () => {
			queryClient.invalidateQueries(['board', { id: boardId }]);
		});

		return () => {
			newSocket.disconnect();
			setSocket(null);
		};
	}, [boardId, queryClient, setSocket]);

	return socket?.id;
};
