import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import BoardRolePopover, { BoardRolePopoverProps } from './BoardRolePopover';

const render = (props: BoardRolePopoverProps) =>
  renderWithProviders(<BoardRolePopover {...props} />);

describe('Components/Primitives/Popovers/BoardRolePopover', () => {
  it('should render correctly', async () => {
    // Arrange
    const boardRolePopoverProps = {
      isNewJoinerHandler: jest.fn(),
      isNewJoiner: false,
      canBeResponsibleHandler: jest.fn(),
      canBeResponsible: false,
    };

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
    const boardRolePopoverProps = {
      isNewJoinerHandler: jest.fn(),
      isNewJoiner: false,
      canBeResponsibleHandler: jest.fn(),
      canBeResponsible: false,
    };

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
    const boardRolePopoverProps = {
      isNewJoinerHandler: jest.fn(),
      isNewJoiner: false,
      canBeResponsibleHandler: jest.fn(),
      canBeResponsible: false,
    };

    // Act
    const { getByTestId, getByText } = render(boardRolePopoverProps);
    const trigger = getByTestId('boardRolePopoverTrigger');
    if (trigger) fireEvent.click(trigger);

    await waitFor(() => {
      const newJoinerSwitch =
        getByText('Responsible allowed').parentElement?.parentElement?.querySelector('button');

      if (newJoinerSwitch) fireEvent.click(newJoinerSwitch);
    });

    // Assert
    await waitFor(() => {
      expect(boardRolePopoverProps.canBeResponsibleHandler).toHaveBeenCalled();
    });
  });
});
