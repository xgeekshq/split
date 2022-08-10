import { QueryClient, QueryClientProvider } from 'react-query';
import { useRouter } from 'next/router';
import { DragDropContext, Droppable } from '@react-forked/dnd';
import { render } from '@testing-library/react';

import { BoardUser } from 'types/board/board.user';
import { BoardUserRoles } from 'utils/enums/board.user.roles';
import CardsList from './CardsList';
import { CardsContainer } from './styles';

/*
MOCK DATA
*/
const boardId = '62f12917c81c816dd0cf77c5';
const colId = '0';
const color = '$highlight1Light';
const hideCards = false;
const isMainboard = false;
const isSubmited = false;
const maxVotes = 6;
const socketId = 'J8AW864LR3ZIy5rxAAAb';
const boardUser: BoardUser = {
	id: '62f12917c81c816dd0cf77da',
	_id: '62f12917c81c816dd0cf77da',
	role: BoardUserRoles.MEMBER,
	user: {
		_id: '62f104ffc81c816dd0cf7765',
		firstName: 'FirstName',
		lastName: 'LastName',
		email: 'email@test.com',
		isSAdmin: false,
		joinedAt: ''
	},
	votesCount: 6
};

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
type WrapperProps = { cards: any[] };

const Wrapper = ({ cards }: WrapperProps) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false
			}
		}
	});

	return (
		<QueryClientProvider client={queryClient}>
			<DragDropContext onDragEnd={() => {}}>
				<Droppable isCombineEnabled droppableId="0" type="CARD">
					{(provided) => (
						<CardsContainer
							direction="column"
							ref={provided.innerRef}
							{...provided.droppableProps}
						>
							<CardsList
								boardId={boardId}
								boardUser={boardUser}
								cards={cards}
								colId={colId}
								color={color}
								hideCards={hideCards}
								isMainboard={isMainboard}
								isSubmited={isSubmited}
								maxVotes={maxVotes}
								socketId={socketId}
								userId={boardUser.id}
							/>
						</CardsContainer>
					)}
				</Droppable>
			</DragDropContext>
		</QueryClientProvider>
	);
};

/* 
TESTS 
*/
describe('List of cards component', () => {
	it('Renders without crashing', () => {
		const cards: any[] = [];

		render(<Wrapper cards={cards} />);
	});

	it('Display the proper number of cards', () => {
		const cards = [
			{
				text: 'Test01',
				items: [
					{
						text: 'Test01',
						votes: [],
						comments: [],
						createdBy: {
							_id: '62f104ffc81c816dd0cf7765',
							firstName: 'FirstName',
							lastName: 'LastName'
						},
						anonymous: true,
						_id: '62f223c1c81c816dd0cf7860',
						id: '62f223c1c81c816dd0cf7860'
					}
				],
				comments: [],
				votes: [],
				createdBy: {
					_id: '62f104ffc81c816dd0cf7765',
					firstName: 'FirstName',
					lastName: 'LastName'
				},
				anonymous: true,
				_id: '62f223c1c81c816dd0cf785f',
				id: '62f223c1c81c816dd0cf785f'
			},
			{
				text: 'Test02',
				items: [
					{
						text: 'Test02',
						votes: [],
						comments: [],
						createdBy: {
							_id: '62f104ffc81c816dd0cf7765',
							firstName: 'FirstName',
							lastName: 'LastName'
						},
						anonymous: true,
						_id: '62f221dfc81c816dd0cf7826',
						id: '62f221dfc81c816dd0cf7826'
					}
				],
				comments: [],
				votes: [],
				createdBy: {
					_id: '62f104ffc81c816dd0cf7765',
					firstName: 'FirstName',
					lastName: 'LastName'
				},
				anonymous: true,
				_id: '62f221dfc81c816dd0cf7825',
				id: '62f221dfc81c816dd0cf7825'
			}
		];

		const { getByTestId } = render(<Wrapper cards={cards} />);

		expect(getByTestId('card1')).toBeTruthy();
		expect(getByTestId('card2')).toBeTruthy();
	});
});
