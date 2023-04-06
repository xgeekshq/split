import { fireEvent, waitFor } from '@testing-library/react';
import { libraryMocks } from '@/utils/testing/mocks';
import { BOARDS_ROUTE } from '@/utils/routes';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import MainPageHeader, {
  MainPagerHeaderProps,
} from '@/components/layouts/Layout/MainPageHeader/MainPageHeader';

const DEFAULT_PROPS: MainPagerHeaderProps = {
  title: 'Boards',
};
const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/' });
const render = (props = DEFAULT_PROPS) =>
  renderWithProviders(<MainPageHeader {...props} />, { routerOptions: mockRouter });

describe('Components/Layouts/Layout/MainPageHeader', () => {
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
      expect(mockRouter.push).toHaveBeenCalledWith(
        headerProps.button.link,
        headerProps.button.link,
        expect.anything(),
      );
    });
  });
});
