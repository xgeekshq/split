import { fireEvent, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import DatePicker, { DatePickerProps } from '@/components/Primitives/DatePicker/DatePicker';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const currentDate = new Date();
const render = (props: Partial<DatePickerProps> = {}) =>
  renderWithProviders(<DatePicker currentDate={currentDate} setDate={jest.fn()} {...props} />);

describe('Components/Primitives/Inputs/UncontrolledInput', () => {
  it('should render correctly', async () => {
    // Act
    const { getByTestId } = render({
      currentDate,
    });

    const uncontrolledInputElement = getByTestId('uncontrolledInput');
    await userEvent.type(getByTestId('uncontrolledInput'), '{arrowdown}');

    // Assert
    await waitFor(() => {
      const calendarElement = getByTestId('calendar');

      expect(uncontrolledInputElement).toBeInTheDocument();

      expect(calendarElement).toBeInTheDocument();
    });
  });

  it('should handle setDate function', async () => {
    // Arrange
    const setDate = jest.fn();

    // Act
    const { getAllByText, getByTestId } = render({ setDate });
    await userEvent.type(getByTestId('uncontrolledInput'), '{arrowdown}');
    await waitFor(() => {
      fireEvent.click(getAllByText('1')[0]);
    });
    // Assert
    await waitFor(() => {
      expect(setDate).toBeCalled();
    });
  });
});
