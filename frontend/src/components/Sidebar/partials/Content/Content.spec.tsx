import { render as rtlRender } from '@testing-library/react';
import Content, { SidebarContentProps } from './Content';

const DEFAULT_PROPS = { strategy: 'local' };
const render = (props: SidebarContentProps = DEFAULT_PROPS) => rtlRender(<Content {...props} />);

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
