import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from 'react-query';

import DeleteCard from './DeleteCard';

/*
MOCK DATA
*/
const boardId = '62f12917c81c816dd0cf77c5';
const cardId = '62f221dfc81c816dd0cf7825';
const cardItemId = '62f104ffc81c816dd0cf7765';
const cardTitle = 'Test Delete';
const socketId = 'J8AW864LR3ZIy5rxAAAb';

/*
AUTH MOCK
*/
const mockSession = {
	expires: 10,
	user: {
		id: '62f104ffc81c816dd0cf7765',
		email: 'email@test.com'
	},
	isSAdmin: false,
	joinedAt: '',
	session: ''
};

jest.mock('next-auth/react', () => {
	return {
		useSession: jest.fn(() => {
			return {
				data: mockSession,
				status: 'authenticated'
			};
		})
	};
});

jest.mock('next/router', () => ({
	useRouter: jest.fn()
}));

(useRouter as jest.Mock).mockImplementation(() => ({
	pathname: '/boards/62f12917c81c816dd0cf77c5',
	query: {
		boardId: '1'
	}
}));

/*
COMPONENT MOCK
*/
interface WrapperProps {}

const Wrapper = ({}: WrapperProps) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false
			}
		}
	});

	const handleDeleting = () => {
		//setDeleting(!deleting);
	};

	return (
		<QueryClientProvider client={queryClient}>
			<DeleteCard
				boardId={boardId}
				cardId={cardId}
				cardItemId={cardItemId}
				cardTitle={cardTitle}
				handleClose={handleDeleting}
				socketId={socketId}
			/>
		</QueryClientProvider>
	);
};

/* 
TESTS 
*/
describe('CardFooter Component', () => {
	it('Renders without crashing', () => {
		render(<Wrapper />);
	});

	it('Displays the card Title', () => {
		const { getByTestId } = render(<Wrapper />);

		expect(getByTestId('cardTitle')).toHaveTextContent(`${cardTitle}`);
	});
});
