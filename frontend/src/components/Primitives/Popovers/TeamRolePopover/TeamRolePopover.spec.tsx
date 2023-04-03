import React from 'react';
import { libraryMocks } from '@/utils/testing/mocks';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import TeamRolePopover, { TeamRolePopoverProps } from './TeamRolePopover';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const render = (props: Partial<TeamRolePopoverProps> = {}) =>
  renderWithProviders(<TeamRolePopover handleRoleChange={jest.fn()} {...props} />, {
    routerOptions: mockRouter,
  });

describe('Components/Primitives/Popovers/TeamRolePopover', () => {
  it('should render correctly', async () => {
    // Act
    const { getByTestId, getByText } = render();
    const trigger = getByTestId('teamRolePopoverTrigger');
    if (trigger) fireEvent.click(trigger);

    // Assert
    await waitFor(() => {
      expect(getByText('Team Member')).toBeInTheDocument();
      expect(getByText('Team Admin')).toBeInTheDocument();
      expect(getByText('Stakeholder')).toBeInTheDocument();
    });
  });

  it('should call handleRoleChange', async () => {
    // Arrange
    const handleRoleChange = jest.fn();

    // Act
    const { getByTestId, getByText } = render({ handleRoleChange });
    const trigger = getByTestId('teamRolePopoverTrigger');
    if (trigger) fireEvent.click(trigger);

    fireEvent.click(getByText('Team Member'));

    // Assert
    await waitFor(() => {
      expect(handleRoleChange).toBeCalled();
    });
  });
});
