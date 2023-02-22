import { RouterContext } from 'next/dist/shared/lib/router-context';
import { fireEvent, render as rtlRender, waitFor } from '@testing-library/react';
import { createMockRouter } from '@/utils/testing/mocks';
import { BOARDS_ROUTE } from '@/utils/routes';
import Tile, { TileProps } from './Tile';

const DEFAULT_PROPS: TileProps = {
  link: BOARDS_ROUTE,
  title: 'Your boards',
  count: 99,
  color: 'purple',
};
const router = createMockRouter({});
const render = (props = DEFAULT_PROPS) =>
  rtlRender(
    <RouterContext.Provider value={router}>
      <Tile {...props} />
    </RouterContext.Provider>,
  );

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
      expect(router.push).toHaveBeenCalledWith(BOARDS_ROUTE, BOARDS_ROUTE, expect.anything());
    });
  });
});
