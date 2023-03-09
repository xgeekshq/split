import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import Content, { SidebarContentProps } from './Content';

const DEFAULT_PROPS = { strategy: 'local' };

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/' });
const render = (props: SidebarContentProps = DEFAULT_PROPS) =>
  renderWithProviders(<Content {...props} />, { routerOptions: mockRouter });

describe('Components/Sidebar/Content', () => {
  it('should render correctly', () => {
    // Arrange
    const contentProps = { ...DEFAULT_PROPS };

    // Act
    const { getAllByTestId, getByText } = render(contentProps);
    const items = getAllByTestId('sidebarItem');

    // Assert
    expect(items).toHaveLength(7);
    // TODO: Improve this Test:
    expect(getByText('Dashboard')).toBeInTheDocument();
    expect(getByText('Boards')).toBeInTheDocument();
    expect(getByText('Users')).toBeInTheDocument();
    expect(getByText('Teams')).toBeInTheDocument();
    expect(getByText('Account')).toBeInTheDocument();
    expect(getByText('Settings')).toBeInTheDocument();
    expect(getByText('Log out')).toBeInTheDocument();
  });
});
