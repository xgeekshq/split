import { fireEvent, waitFor } from '@testing-library/react';

import UserListDialog, {
  UserListDialogProps,
} from '@/components/Primitives/Dialogs/UserListDialog/UserListDialog';
import { UserListFactory } from '@/utils/factories/user';
import { createMockRouter } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const router = createMockRouter({});

const render = (props: Partial<UserListDialogProps> = {}) =>
  renderWithProviders(
    <UserListDialog
      isOpen
      confirmationHandler={jest.fn()}
      confirmationLabel="confirm"
      setIsOpen={jest.fn()}
      title="Title"
      usersList={UserListFactory.createMany(3)}
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
    expect(getByTestId('searchInput')).toBeInTheDocument();
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
