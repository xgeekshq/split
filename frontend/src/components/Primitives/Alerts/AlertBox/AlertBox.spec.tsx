import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import AlertBox, { AlertBoxProps } from '@/components/Primitives/Alerts/AlertBox/AlertBox';
import Button from '@/components/Primitives/Inputs/Button/Button';

const render = ({ children, ...props }: Partial<AlertBoxProps> = {}) =>
  renderWithProviders(
    <AlertBox type="info" title="Title" text="Text" {...props}>
      {children}
    </AlertBox>,
  );

describe('Components/Primitives/Alerts/AlertBox', () => {
  it('should render correctly', () => {
    // Act
    const { getByTestId } = render();

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
    const alertBoxChild = <Button>Button</Button>;

    // Act
    const { getByTestId, getByText } = render({ children: alertBoxChild });

    // Assert
    expect(getByTestId('alertBox')).toBeInTheDocument();
    expect(getByText('Button')).toBeInTheDocument();
  });
});
