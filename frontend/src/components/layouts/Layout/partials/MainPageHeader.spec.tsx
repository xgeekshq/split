import { RouterContext } from 'next/dist/shared/lib/router-context';
import { fireEvent, render as rtlRender, waitFor } from '@testing-library/react';
import { createMockRouter } from '@/utils/testing/mocks';
import { BOARDS_ROUTE } from '@/utils/routes';
import MainPageHeader, { MainPagerHeaderProps } from './MainPageHeader';

const DEFAULT_PROPS: MainPagerHeaderProps = {
  title: 'Boards',
};
const router = createMockRouter({});
const render = (props = DEFAULT_PROPS) =>
  rtlRender(
    <RouterContext.Provider value={router}>
      <MainPageHeader {...props} />
    </RouterContext.Provider>,
  );

describe('Components/Dashboard/Tiles/Tile', () => {
  it('should render correctly', () => {
    // Arrange
    const headerProps = { ...DEFAULT_PROPS };

    // Act
    const { getByText } = render(headerProps);

    // Assert
    expect(getByText(headerProps.title)).toBeInTheDocument();
  });

  it('should be able to render a button', () => {
    // Arrange
    const headerProps = {
      ...DEFAULT_PROPS,
      button: {
        link: BOARDS_ROUTE,
        label: 'Add new board',
      },
    };

    // Act
    const { getByText } = render(headerProps);

    // Assert
    expect(getByText(headerProps.button.label)).toBeInTheDocument();
  });

  it('should redirect correctly', async () => {
    // Arrange
    const headerProps = {
      ...DEFAULT_PROPS,
      button: {
        link: BOARDS_ROUTE,
        label: 'Add new board',
      },
    };

    // Act
    const { getByTestId } = render(headerProps);
    const button = getByTestId('MainPageHeader').querySelector('button');
    fireEvent.click(button!);

    // Assert
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith(
        headerProps.button.link,
        headerProps.button.link,
        expect.anything(),
      );
    });
  });
});
