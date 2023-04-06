import React from 'react';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { UserFactory } from '@/utils/factories/user';
import { fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DuplicateBoardNameDialog, {
  DuplicateBoardNameDialogProps,
} from '@/components/CardBoard/CardBody/DuplicateBoardNameDialog';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const mockUser = UserFactory.create();

const render = (props: Partial<DuplicateBoardNameDialogProps> = {}) =>
  renderWithProviders(
    <DuplicateBoardNameDialog handleDuplicateBoard={jest.fn()} boardTitle="My Board" {...props} />,
    {
      routerOptions: mockRouter,
      sessionOptions: { user: mockUser },
    },
  );

describe('Components/CardBoard/CardBody/DuplicateBoardNameDialog', () => {
  it('should render correctly', async () => {
    // Act
    const { getByTestId } = render();

    // Assert
    const trigger = getByTestId('duplicateBoardTrigger');
    expect(trigger).toBeInTheDocument();

    fireEvent.click(trigger);

    await waitFor(() => {
      expect(getByTestId('duplicateBoardSubmit')).toBeInTheDocument();
    });
  });

  it('should disable the submit button when input empty', async () => {
    // Act
    const { getByTestId } = render();

    // Assert
    fireEvent.click(getByTestId('duplicateBoardTrigger'));

    await waitFor(() => {
      expect(getByTestId('duplicateBoardSubmit')).toBeDisabled();
    });
  });

  it('should disable the submit button when input value exceeds max chars', async () => {
    // Act
    const { getByTestId, getByLabelText } = render();

    // Assert
    fireEvent.click(getByTestId('duplicateBoardTrigger'));

    await waitFor(() => {
      expect(getByTestId('duplicateBoardSubmit')).toBeDisabled();
    });

    const input = getByLabelText('Board title');

    fireEvent.change(input, {
      target: {
        value:
          'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      },
    });

    await waitFor(() => {
      expect(getByTestId('duplicateBoardSubmit')).toBeDisabled();
    });
  });

  it('should call handler function', async () => {
    // Act
    const mockHandler = jest.fn();
    const { getByTestId, getByLabelText } = render({ handleDuplicateBoard: mockHandler });

    fireEvent.click(getByTestId('duplicateBoardTrigger'));

    const input = getByLabelText('Board title');

    await act(() => {
      userEvent.clear(input);
      userEvent.type(input, 'My Other Board');
    });

    await waitFor(() => {
      expect(input).toHaveValue('My Other Board');
      expect(getByTestId('duplicateBoardSubmit')).not.toBeDisabled();
    });

    fireEvent.click(getByTestId('duplicateBoardSubmit'));

    // Assert
    await waitFor(() => {
      expect(mockHandler).toBeCalled();
    });
  });

  it('should open tooltip', async () => {
    // Act
    const { getByRole } = render();

    // Assert
    expect(getByRole('button')).toBeInTheDocument();

    userEvent.hover(getByRole('button'));

    await waitFor(() => {
      expect(getByRole('tooltip')).toBeInTheDocument();
      expect(getByRole('tooltip')).toHaveTextContent('Duplicate board');
    });
  });
});
