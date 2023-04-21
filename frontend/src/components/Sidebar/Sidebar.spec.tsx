import Sidebar from '@/components/Sidebar/Sidebar';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { SidebarProps } from '@components/Sidebar/types';

const DEFAULT_PROPS = {
  firstName: 'First',
  lastName: 'Last',
  email: 'first.last@mail.com',
  strategy: 'local',
};

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/' });

const render = (props: SidebarProps = DEFAULT_PROPS) =>
  renderWithProviders(<Sidebar {...props} />, { routerOptions: mockRouter });

describe('Components/Sidebar', () => {
  it('should render correctly', () => {
    // Arrange
    const sidebarProps = { ...DEFAULT_PROPS };

    // Act
    const { getByTestId } = render(sidebarProps);

    // Assert
    expect(getByTestId('sidebarHeader')).toBeInTheDocument();
    expect(getByTestId('sidebarContent')).toBeInTheDocument();
  });
});
