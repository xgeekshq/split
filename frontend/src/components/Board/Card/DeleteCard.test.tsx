import { useRouter } from 'next/router';
import { fireEvent, render, waitFor } from '@testing-library/react';

import DeleteCard from './DeleteCard';

jest.mock('react-query');

const mockSession = {
	expires: 1,
	user: {
		id: '1',
		email: 'test@mail.com'
	}
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
	pathname: '/',
	query: {
		boardId: 'any_id'
	}
}));

const mockedUseCards = {
	deleteCard: {
		mutate: jest.fn()
	}
};

jest.mock('hooks/useCards', () => ({
	__esModule: true,
	default: () => mockedUseCards
}));

const initialProps = {
	cardId: 'any_id',
	cardTitle: 'any_title',
	boardId: 'any_id',
	socketId: 'any_id',
	handleClose: () => {},
	cardItemId: 'any_id'
};

describe('DeleteCard', () => {
	describe('DeleteCard()', () => {
		it('should render "DeleteCard', () => {
			const { getByText } = render(<DeleteCard {...initialProps} />);

			expect(getByText(initialProps.cardTitle)).toBeInTheDocument();
		});

		it('should call deleteCard function when user click to DeleteCard button', async () => {
			const spy = jest.spyOn(mockedUseCards.deleteCard, 'mutate');

			const { getAllByText } = render(<DeleteCard {...initialProps} />);

			const btnDeleteCard = getAllByText('Delete card')[1];
			await waitFor(() => fireEvent.click(btnDeleteCard));
			expect(spy).toHaveBeenCalledTimes(1);
			spy.mockRestore();
		});
	});
});
