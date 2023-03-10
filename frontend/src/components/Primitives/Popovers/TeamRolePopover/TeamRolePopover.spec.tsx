import React from 'react';
import { libraryMocks } from '@/utils/testing/mocks';
import { fireEvent, waitFor } from '@testing-library/react';
import { TeamFactory } from '@/utils/factories/team';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import TeamRolePopover, { TeamRolePopoverProps } from './TeamRolePopover';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const render = (props: TeamRolePopoverProps) =>
  renderWithProviders(<TeamRolePopover {...props} />, { routerOptions: mockRouter });

describe('Components/Primitives/Popovers/TeamRolePopover', () => {
  it('should render correctly', async () => {
    // Arrange
    const team = TeamFactory.create();
    const teamRolePopoverProps = {
      userId: team.users[0]._id,
      teamId: team.id,
      isTeamPage: true,
    };

    // Act
    const { getByTestId, getByText } = render(teamRolePopoverProps);
    const trigger = getByTestId('teamRolePopoverTrigger');
    if (trigger) fireEvent.click(trigger);

    // Assert
    await waitFor(() => {
      expect(getByText('Team Member')).toBeInTheDocument();
      expect(getByText('Team Admin')).toBeInTheDocument();
      expect(getByText('Stakeholder')).toBeInTheDocument();
    });
  });
});
