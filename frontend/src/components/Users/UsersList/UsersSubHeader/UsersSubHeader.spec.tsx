import { fireEvent, waitFor } from '@testing-library/react';

import UsersSubHeader, {
  UsersSubHeaderProps,
} from '@/components/Users/UsersList/UsersSubHeader/UsersSubHeader';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const render = (props: Partial<UsersSubHeaderProps> = {}) =>
  renderWithProviders(
    <UsersSubHeader
      handleClearSearch={jest.fn()}
      handleSearchUser={jest.fn()}
      search=""
      userAmount={2}
      {...props}
    />,
  );

describe('Users/UsersList/UsersSubHeader', () => {
  it('should render correctly', () => {
    // Act
    const { getByText } = render();

    // Assert
    expect(getByText('2 registered users')).toBeInTheDocument;
  });

  it('should handle clear search', async () => {
    // Arrange
    const mockClearSearch = jest.fn();

    // Act
    const { getByTestId } = render({ handleClearSearch: mockClearSearch });
    const clearBtn = getByTestId('searchInput').querySelector('div[data-type="clear"]')!;
    fireEvent.click(clearBtn);

    // Assert
    await waitFor(() => {
      expect(mockClearSearch).toHaveBeenCalled();
    });
  });
});
