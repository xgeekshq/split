import { createMockRouter } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { UserListFactory } from '@/utils/factories/user';
import { fireEvent, waitFor } from '@testing-library/react';
import UserListDialog, { UserListDialogProps } from '.';

const DEFAULT_PROPS = {
  usersList: UserListFactory.createMany(3),
  setIsOpen: jest.fn(),
  isOpen: true,
  title: 'Team Members',
  confirmationLabel: 'Save',
  confirmationHandler: jest.fn(),
};

const router = createMockRouter({});

const render = (props: UserListDialogProps = DEFAULT_PROPS) =>
  renderWithProviders(<UserListDialog {...props} />, { routerOptions: router });

describe('Components/Primitives/Dialogs/UserListDialog/CheckboxUserItem', () => {
  it('should render correctly', () => {
    // Arrange
    const testProps = { ...DEFAULT_PROPS };

    // Act
    const { getByText, getAllByTestId, getByTestId } = render(testProps);

    // Assert
    expect(getAllByTestId('checkboxUserItem')).toHaveLength(testProps.usersList.length);
    expect(getByText(testProps.confirmationLabel)).toBeInTheDocument();
    expect(getByTestId('searchInput')).toBeInTheDocument();
  });

  it('should call confirmationHandler function', async () => {
    // Arrange
    const testProps = { ...DEFAULT_PROPS };

    // Act
    const { getByTestId } = render(testProps);

    // Assert
    fireEvent.click(getByTestId('dialogFooterSubmit'));

    await waitFor(() => {
      expect(testProps.confirmationHandler).toBeCalled();
    });
  });
});
