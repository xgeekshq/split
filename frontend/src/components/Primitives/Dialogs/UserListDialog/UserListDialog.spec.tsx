import { createMockRouter } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { UserListFactory } from '@/utils/factories/user';
import { fireEvent, waitFor } from '@testing-library/react';
import UserListDialog, {
  UserListDialogProps,
} from '@/components/Primitives/Dialogs/UserListDialog/UserListDialog';

const router = createMockRouter({});

const render = (props: Partial<UserListDialogProps> = {}) =>
  renderWithProviders(
    <UserListDialog
      usersList={UserListFactory.createMany(3)}
      setIsOpen={jest.fn()}
      isOpen
      confirmationHandler={jest.fn()}
      confirmationLabel="confirm"
      title="Title"
      {...props}
    />,
    { routerOptions: router },
  );

describe('Components/Primitives/Dialogs/UserListDialog', () => {
  it('should render correctly', () => {
    // Arrange
    const usersList = UserListFactory.createMany(3);

    // Act
    const { getAllByTestId, getByTestId } = render({ usersList });

    // Assert
    expect(getAllByTestId('checkboxUserItem')).toHaveLength(usersList.length);
    expect(getByTestId('uncontrolledInput')).toBeInTheDocument();
  });

  it('should call confirmationHandler function', async () => {
    // Arrange
    const confirmationHandler = jest.fn();

    // Act
    const { getByTestId } = render({ confirmationHandler });

    // Assert
    fireEvent.click(getByTestId('dialogFooterSubmit'));

    await waitFor(() => {
      expect(confirmationHandler).toBeCalled();
    });
  });
});
