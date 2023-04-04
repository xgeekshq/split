import { render as rtlRender } from '@testing-library/react';
import Tiles, { TilesProps } from '@/components/Dashboard/Tiles/Tiles';

const DEFAULT_PROPS: TilesProps = {
  data: {
    boardsCount: 99,
    usersCount: 99,
    teamsCount: 99,
  },
};
const render = (props = DEFAULT_PROPS) => rtlRender(<Tiles {...props} />);

describe('Components/Dashboard/Tiles/Tile', () => {
  it('should render correctly', () => {
    // Arrange
    const dashboardTilesProps = { ...DEFAULT_PROPS };

    // Act
    const { getAllByTestId } = render(dashboardTilesProps);

    // Assert
    expect(getAllByTestId('tile')).toHaveLength(3);
  });
});
