import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import BoardRolePopover, {
  BoardRolePopoverProps,
} from '@/components/Primitives/Popovers/BoardRolePopover/BoardRolePopover';

const DEFAULT_PROPS = {
  isNewJoinerHandler: jest.fn(),
  isNewJoiner: false,
  canBeResponsibleHandler: jest.fn(),
  canBeResponsible: false,
};

const render = (props: BoardRolePopoverProps) =>
  renderWithProviders(<BoardRolePopover {...props} />);

describe('Components/Primitives/Popovers/BoardRolePopover', () => {
  it('should render correctly', async () => {
    // Arrange
    const boardRolePopoverProps = { ...DEFAULT_PROPS };

    // Act
    const { getByTestId, getAllByTestId } = render(boardRolePopoverProps);
    const trigger = getByTestId('boardRolePopoverTrigger');
    if (trigger) fireEvent.click(trigger);

    // Assert
    await waitFor(() => {
      expect(getAllByTestId('configurationSwitch')).toHaveLength(2);
    });
  });

  it('should handle isNewJoiner change', async () => {
    // Arrange
    const boardRolePopoverProps = { ...DEFAULT_PROPS };

    // Act
    const { getByTestId, getByText } = render(boardRolePopoverProps);
    const trigger = getByTestId('boardRolePopoverTrigger');
    if (trigger) fireEvent.click(trigger);

    await waitFor(() => {
      const newJoinerSwitch =
        getByText('New Joiner').parentElement?.parentElement?.querySelector('button');

      if (newJoinerSwitch) fireEvent.click(newJoinerSwitch);
    });

    // Assert
    await waitFor(() => {
      expect(boardRolePopoverProps.isNewJoinerHandler).toHaveBeenCalled();
    });
  });

  it('should handle canBeResponsible change', async () => {
    // Arrange
    const boardRolePopoverProps = { ...DEFAULT_PROPS };

    // Act
    const { getByTestId, getByText } = render(boardRolePopoverProps);
    const trigger = getByTestId('boardRolePopoverTrigger');
    if (trigger) fireEvent.click(trigger);

    await waitFor(() => {
      const canBeResponsibleSwitch =
        getByText('Responsible allowed').parentElement?.parentElement?.querySelector('button');

      if (canBeResponsibleSwitch) fireEvent.click(canBeResponsibleSwitch);
    });

    // Assert
    await waitFor(() => {
      expect(boardRolePopoverProps.canBeResponsibleHandler).toHaveBeenCalled();
    });
  });

  it('should disable isNewJoiner switch', async () => {
    // Arrange
    const boardRolePopoverProps = {
      ...DEFAULT_PROPS,
      canBeResponsible: true,
    };

    // Act
    const { getByTestId, getByText } = render(boardRolePopoverProps);
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
    // Arrange
    const boardRolePopoverProps = {
      ...DEFAULT_PROPS,
      isNewJoiner: true,
    };

    // Act
    const { getByTestId, getByText } = render(boardRolePopoverProps);
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
    // Arrange
    const boardRolePopoverProps = {
      ...DEFAULT_PROPS,
    };

    // Act
    const { getByTestId, getByText } = render(boardRolePopoverProps);
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
