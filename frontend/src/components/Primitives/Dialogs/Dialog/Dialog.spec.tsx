import { createMockRouter } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { fireEvent, waitFor } from '@testing-library/dom';
import Dialog, { DialogProps } from './Dialog';
import { HeaderProps } from './DialogHeader';
import { FooterProps } from './DialogFooter';
import Flex from '../../Layout/Flex/Flex';

const DEFAULT_PROPS = {
  isOpen: true,
  setIsOpen: jest.fn(),
  children: 'Modal Content',
  title: 'Modal Title',
  affirmativeLabel: 'Confirm',
  handleAffirmative: jest.fn(),
  handleClose: jest.fn(),
};

const router = createMockRouter({});

const render = (props: DialogProps & HeaderProps & FooterProps) =>
  renderWithProviders(
    <Dialog isOpen={props.isOpen} setIsOpen={props.setIsOpen}>
      <Dialog.Header title={props.title} />
      <Flex
        align="center"
        justify="center"
        direction="column"
        css={{ height: '100%', overflow: 'auto' }}
      >
        {props.children}
      </Flex>
      <Dialog.Footer
        handleClose={props.handleClose}
        handleAffirmative={props.handleAffirmative}
        affirmativeLabel={props.affirmativeLabel}
      />
    </Dialog>,
    { routerOptions: router },
  );

describe('Components/Primitives/Dialogs/Dialog', () => {
  it('should render correctly', () => {
    // Arrange
    const testProps = { ...DEFAULT_PROPS };

    // Act
    const { getByText } = render(testProps);

    // Assert
    expect(getByText(testProps.children)).toBeInTheDocument();
    expect(getByText(testProps.title)).toBeInTheDocument();
    expect(getByText(testProps.affirmativeLabel)).toBeInTheDocument();
  });

  it('should call handleAffirmative', async () => {
    // Arrange
    const testProps = { ...DEFAULT_PROPS };

    // Act
    const { getByText } = render(testProps);
    fireEvent.click(getByText(testProps.affirmativeLabel));

    // Assert
    await waitFor(() => {
      expect(testProps.handleAffirmative).toHaveBeenCalled();
    });
  });

  it('should call handleClose', async () => {
    // Arrange
    const testProps = { ...DEFAULT_PROPS };

    // Act
    const { getByText } = render(testProps);
    fireEvent.click(getByText('Cancel'));

    // Assert
    await waitFor(() => {
      expect(testProps.handleClose).toHaveBeenCalled();
    });
  });
});
