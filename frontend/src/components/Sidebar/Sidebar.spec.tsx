import { render as rtlRender } from '@testing-library/react';
import Sidebar, { SidebarProps } from './index';

const DEFAULT_PROPS = {
  firstName: 'First',
  lastName: 'Last',
  email: 'first.last@mail.com',
  strategy: 'local',
};
const render = (props: SidebarProps = DEFAULT_PROPS) => rtlRender(<Sidebar {...props} />);

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
