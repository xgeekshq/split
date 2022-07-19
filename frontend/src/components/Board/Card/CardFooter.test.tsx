import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import CardType from 'types/card/card';
import { useRouter } from 'next/router'
import CardFooter from './CardFooter';
import CommentType from 'types/comment/comment';
import { BoardUser } from 'types/board/board.user';
import * as useVotes from 'hooks/useVotes';
import userEvent from '@testing-library/user-event';

jest.mock('react-query');
jest.mock("next-auth/react", () => {
  const mockSession = {
    expires: 1,
    user: { id: '1', username: "user1" }
  };
  return {
    useSession: jest.fn(() => {
      return {data: mockSession, status: 'authenticated'}
    }),
  };
});

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

(useRouter as jest.Mock).mockImplementation(() => ({
  pathname: '/',
  query: {
    boardId: '1'
  },
}));

jest.mock('hooks/useVotes', () => {
  return {
    useAddVote: () => ({
      mutate: jest.fn
    }),
    useDeleteVote: () => ({
      mutate: jest.fn
    }),
    // default: () => {
    //   addVote: {
    //     mutate: jest.fn,
    //   },
    //   deleteVote: {
    //     mutate: jest.fn
    //   }
    // }
  }
});

describe('CardFooter', () => {
  it.only('should render CardFooter', async() => {
    const boardId = '1';
    const socketId = '1'
    const userId = '1';
    const anonymous = false;
    const isItem = false;
    const isMainboard = false;
    const isCommentOpened = false;
    const maxVotes = 6;
    const hideCards = false;


    const mockedCard = {
      createdBy: {
        firstName: 'First',
        lastName: 'Last'
      },
      comments: [{}, {}],
      items: [
        {
          text: 'text1',
          createdBy: {
            firstName: 'First',
            lastName: 'Last'
          },
          votes: ['id_1', 'id_2'],
        }
      ]
    } as CardType;
    
    const mockedComments = [
    
    ] as CommentType[];
    
    const mockedBoardUser = {
    
    } as BoardUser


    const spy = jest.spyOn(useVotes, 'useAddVote');
    
    const mockedMutate = () => {
      return jest.fn(() => console.log('chamei o mock'))
    };

    // .mockImplementationOnce(() => {
    //   return () => ({
    //     mutate: mockedMutate
    //   }
    //   // return () => ({
    //   //   addVote: {
    //   //     mutate: mockedMutate
    //   //   },
    //   //   deleteVote: jest.fn()
    //   // } as any)
    // });

    const { debug, getByText } = render(
      <CardFooter
        boardId={boardId}
        socketId={socketId}
        userId={userId}
        anonymous={anonymous}
        card={mockedCard}
        teamName={mockedCard.createdByTeam}
        isItem={isItem}
        isMainboard={isMainboard}
        comments={mockedComments}
        setOpenComments={() => {}}
        isCommentsOpened={isCommentOpened}
        boardUser={mockedBoardUser}
        maxVotes={maxVotes}
        hideCards={hideCards}
      />
    );

    const addVoteButton = screen.getByTestId('custom-element');
    await waitFor(() => userEvent.click(addVoteButton));
    await waitFor(() => expect(spy).toHaveBeenCalled());

    expect(getByText('First Last')).toBeInTheDocument();
    expect(getByText('FL')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
  });
});