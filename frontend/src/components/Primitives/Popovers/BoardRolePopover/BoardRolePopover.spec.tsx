import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';

import BoardRolePopover, {
  BoardRolePopoverProps,
} from '@/components/Primitives/Popovers/BoardRolePopover/BoardRolePopover';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const render = (props: Partial<BoardRolePopoverProps> = {}) =>
  renderWithProviders(
    <BoardRolePopover
      canBeResponsible={false}
      canBeResponsibleHandler={jest.fn()}
      isNewJoiner={false}
      isNewJoinerHandler={jest.fn()}
      {...props}
    />,
  );

describe('Components/Primitives/Popovers/BoardRolePopover', () => {
  it('should render correctly', async () => {
    // Act
    const { getByTestId, getAllByTestId } = render();
    const trigger = getByTestId('boardRolePopoverTrigger');
    if (trigger) fireEvent.click(trigger);

    // Assert
    await waitFor(() => {
      expect(getAllByTestId('configurationSwitch')).toHaveLength(2);
    });
  });

  it('should handle isNewJoiner change', async () => {
    // Arrange
    const isNewJoinerHandler = jest.fn();

    // Act
    const { getByTestId, getByText } = render({ isNewJoinerHandler });
    const trigger = getByTestId('boardRolePopoverTrigger');
    if (trigger) fireEvent.click(trigger);

    await waitFor(() => {
      const newJoinerSwitch =
        getByText('New Joiner').parentElement?.parentElement?.querySelector('button');

      if (newJoinerSwitch) fireEvent.click(newJoinerSwitch);
    });

    // Assert
    await waitFor(() => {
      expect(isNewJoinerHandler).toHaveBeenCalled();
    });
  });

  it('should handle canBeResponsible change', async () => {
    // Arrange
    const canBeResponsibleHandler = jest.fn();

    // Act
    const { getByTestId, getByText } = render({ canBeResponsibleHandler });
    const trigger = getByTestId('boardRolePopoverTrigger');
    if (trigger) fireEvent.click(trigger);

    await waitFor(() => {
      const canBeResponsibleSwitch =
        getByText('Responsible allowed').parentElement?.parentElement?.querySelector('button');

      if (canBeResponsibleSwitch) fireEvent.click(canBeResponsibleSwitch);
    });

    // Assert
    await waitFor(() => {
      expect(canBeResponsibleHandler).toHaveBeenCalled();
    });
  });

  it('should disable isNewJoiner switch', async () => {
    // Act
    const { getByTestId, getByText } = render({ canBeResponsible: true });
    const trigger = getByTestId('boardRolePopoverTrigger');
    if (trigger) fireEvent.click(trigger);

    // Assert
    await waitFor(() => {
      const newJoinerSwitch =
        getByText('New Joiner').parentElement?.parentElement?.querySelector('button');

      expect(newJoinerSwitch).toBeDisabled();
    });
  });

  it('should disable canBeResponsible switch', async () => {
    // Act
    const { getByTestId, getByText } = render({ isNewJoiner: true });
    const trigger = getByTestId('boardRolePopoverTrigger');
    if (trigger) fireEvent.click(trigger);

    // Assert
    await waitFor(() => {
      const canBeResponsibleSwitch =
        getByText('Responsible allowed').parentElement?.parentElement?.querySelector('button');

      expect(canBeResponsibleSwitch).toBeDisabled();
    });
  });

  it('should enable both switches', async () => {
    // Act
    const { getByTestId, getByText } = render();
    const trigger = getByTestId('boardRolePopoverTrigger');
    if (trigger) fireEvent.click(trigger);

    // Assert
    await waitFor(() => {
      const canBeResponsibleSwitch =
        getByText('Responsible allowed').parentElement?.parentElement?.querySelector('button');

      const newJoinerSwitch =
        getByText('New Joiner').parentElement?.parentElement?.querySelector('button');

      expect(canBeResponsibleSwitch).not.toBeDisabled();
      expect(newJoinerSwitch).not.toBeDisabled();
    });
  });
});
