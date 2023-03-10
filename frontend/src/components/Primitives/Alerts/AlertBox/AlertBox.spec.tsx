import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import AlertBox, { AlertBoxProps } from '@/components/Primitives/Alerts/AlertBox/AlertBox';
import Button from '../../Button';

const render = (props: AlertBoxProps, children?: React.ReactNode) =>
  renderWithProviders(<AlertBox {...props}>{children}</AlertBox>);

describe('Components/Primitives/AlertBox', () => {
  it('should render correctly', () => {
    // Arrange
    const alertBoxProps: AlertBoxProps = { type: 'info' };

    // Act
    const { getByTestId } = render(alertBoxProps);

    // Assert
    expect(getByTestId('alertBox')).toBeInTheDocument();
  });

  it('should render title, text and type', () => {
    // Arrange
    const alertBoxProps: AlertBoxProps = { type: 'error', title: 'Title', text: 'This is Text' };

    // Act
    const { getByTestId, getByText } = render(alertBoxProps);
    const alertBox = getByTestId('alertBox');
    const icon = alertBox.querySelector('use')?.getAttribute('href');

    // Assert
    expect(alertBox).toBeInTheDocument();

    expect(icon).toBe(`#blob-${alertBoxProps.type}`);

    if (alertBoxProps.title) {
      expect(getByText(alertBoxProps.title)).toBeInTheDocument();
    }

    if (alertBoxProps.text) {
      expect(getByText(alertBoxProps.text)).toBeInTheDocument();
    }
  });

  it('should render children', () => {
    // Arrange
    const alertBoxProps: AlertBoxProps = { type: 'error', title: 'Title', text: 'This is Text' };
    const alertBoxChild = <Button>Button</Button>;

    // Act
    const { getByTestId, getByText } = render(alertBoxProps, alertBoxChild);

    // Assert
    expect(getByTestId('alertBox')).toBeInTheDocument();
    expect(getByText('Button')).toBeInTheDocument();
  });
});
