import { fireEvent, waitFor } from '@testing-library/react';

import Tile, { TileProps } from '@/components/Dashboard/Tiles/Tile/Tile';
import { BOARDS_ROUTE } from '@/utils/routes';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const DEFAULT_PROPS: TileProps = {
  link: BOARDS_ROUTE,
  title: 'Your boards',
  count: 99,
  color: 'purple',
};

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/' });
const render = (props = DEFAULT_PROPS) =>
  renderWithProviders(<Tile {...props} />, { routerOptions: mockRouter });

describe('Components/Dashboard/Tiles/Tile', () => {
  it('should render correctly', () => {
    // Arrange
    const tileProps = { ...DEFAULT_PROPS };

    // Act
    const { getByText } = render(tileProps);

    // Assert
    expect(getByText(tileProps.title)).toBeInTheDocument();
    expect(getByText(tileProps.count)).toBeInTheDocument();
  });

  it('should redirect correctly', async () => {
    // Arrange
    const tileProps = { ...DEFAULT_PROPS };

    // Act
    const { getByTestId } = render(tileProps);
    fireEvent.click(getByTestId('tile'));

    // Assert
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(BOARDS_ROUTE, BOARDS_ROUTE, expect.anything());
    });
  });
});
