import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useRouter } from 'next/router';
import { DragDropContext, Droppable } from '@react-forked/dnd';
import { render } from '@testing-library/react';

import CardType from 'types/card/card';
import { CardsContainer } from '../Column/styles';
import CardBoard from './CardBoard';

/*
MOCK CARD DATA
*/
const cardId = '62f223c1c81c816dd0cf7860';
const boardId = '62f12917c81c816dd0cf77c5';
const colId = '0';
const color = '$highlight1Light';
const hideCards = false;
const index = 0;
const isMainboard = false;
const isSubmited = false;
const maxVotes = 6;
const socketId = 'J8AW864LR3ZIy5rxAAAb';
const boardUser = {
	id: '62f12917c81c816dd0cf77da',
	_id: '62f12917c81c816dd0cf77da',
	role: 'responsible',
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
interface WrapperProp {
	card: CardType;
}

const Wrapper = ({ card }: WrapperProp) => {
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
							<CardBoard
								key={cardId}
								boardId={boardId}
								boardUser={boardUser}
								card={card}
								colId={colId}
								color={color}
								hideCards={hideCards}
								index={index}
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

describe('One Card Component', () => {
	const card: CardType = {
		text: 'Test',
		items: [
			{
				text: 'Test',
				votes: [],
				comments: [
					{
						text: 'Comment #2',
						createdBy: {
							_id: '62f104ffc81c816dd0cf7765',
							firstName: 'FirstName',
							lastName: 'LastName',
							email: 'email@test.com',
							isSAdmin: false,
							joinedAt: ''
						},
						_id: '62f2250bc81c816dd0cf7872'
					},
					{
						text: 'Comment #2',
						createdBy: {
							_id: '62f104ffc81c816dd0cf7765',
							firstName: 'FirstName',
							lastName: 'LastName',
							email: 'email@test.com',
							isSAdmin: false,
							joinedAt: ''
						},
						_id: '62f2250bc81c816dd3cf7872'
					}
				],
				createdBy: {
					_id: '62f104ffc81c816dd0cf7765',
					firstName: 'FirstName',
					lastName: 'LastName',
					email: 'email@test.com',
					isSAdmin: false,
					joinedAt: ''
				},
				anonymous: true,
				_id: '62f221dfc81c816dd0cf7826'
			}
		],
		comments: [],
		votes: [],
		createdBy: {
			_id: '62f104ffc81c816dd0cf7765',
			firstName: 'FirstName',
			lastName: 'LastName',
			email: 'email@test.com',
			isSAdmin: false,
			joinedAt: ''
		},
		anonymous: true,
		_id: '62f221dfc81c816dd0cf7825'
	};

	it('Renders without crashing', () => {
		render(<Wrapper card={card} />);
	});

	it('Should display the card text', () => {
		const { getByTestId } = render(<Wrapper card={card} />);

		expect(getByTestId('cardTitle')).toHaveTextContent(card.text);
	});
});

describe('Multi Card Component', () => {
	const card: CardType = {
		text: 'Test',
		items: [
			{
				text: 'Test',
				votes: [],
				comments: [
					{
						text: 'Comment #2',
						createdBy: {
							_id: '62f104ffc81c816dd0cf7765',
							firstName: 'FirstName',
							lastName: 'LastName',
							email: 'email@test.com',
							isSAdmin: false,
							joinedAt: ''
						},
						_id: '62f2250bc81c816dd0cf7872'
					},
					{
						text: 'Comment #2',
						createdBy: {
							_id: '62f104ffc81c816dd0cf7765',
							firstName: 'FirstName',
							lastName: 'LastName',
							email: 'email@test.com',
							isSAdmin: false,
							joinedAt: ''
						},
						_id: '62f2250bc81c816dd3cf7872'
					}
				],
				createdBy: {
					_id: '62f104ffc81c816dd0cf7765',
					firstName: 'FirstName',
					lastName: 'LastName',
					email: 'email@test.com',
					isSAdmin: false,
					joinedAt: ''
				},
				anonymous: true,
				_id: '62f221dfc81c816dd0cf7826'
			},
			{
				text: 'Test 02',
				votes: [],
				comments: [],
				createdBy: {
					_id: '62f104ffc81c816dd0cf7765',
					firstName: 'FirstName',
					lastName: 'LastName',
					email: 'email@test.com',
					isSAdmin: false,
					joinedAt: ''
				},
				anonymous: true,
				_id: '62f221dfc81c856dd0cf7826'
			}
		],
		comments: [],
		votes: [],
		createdBy: {
			_id: '62f104ffc81c816dd0cf7765',
			firstName: 'FirstName',
			lastName: 'LastName',
			email: 'email@test.com',
			isSAdmin: false,
			joinedAt: ''
		},
		anonymous: true,
		_id: '62f221dfc81c816dd0cf7825'
	};

	it('Renders without crashing', () => {
		render(<Wrapper card={card} />);
	});

	it('Should display the number of cards merged', () => {
		const { getByTestId } = render(<Wrapper card={card} />);

		expect(getByTestId('cardCount')).toHaveTextContent(`${card.items.length} merged cards`);
	});
});
