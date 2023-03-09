import React from 'react';
import { libraryMocks } from '@/utils/testing/mocks';
import { fireEvent, waitFor } from '@testing-library/react';
import { TeamFactory } from '@/utils/factories/team';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import PopoverRoleSettings, { PopoverRoleSettingsProps } from './PopoverRoleSettings';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const render = (props: PopoverRoleSettingsProps) =>
  renderWithProviders(<PopoverRoleSettings {...props} />, { routerOptions: mockRouter });

describe('Components/Teams/Team/TeamMemberItem/PopoverRoleSettings', () => {
  it('should render correctly', async () => {
    // Arrange
    const team = TeamFactory.create();
    const popoverRoleSettingsProps = {
      userId: team.users[0]._id,
      teamId: team.id,
      isTeamPage: true,
    };

    // Act
    const { getByTestId, getByText } = render(popoverRoleSettingsProps);
    const trigger = getByTestId('popoverRoleSettingsTrigger');
    if (trigger) fireEvent.click(trigger);

    // Assert
    await waitFor(() => {
      expect(getByText('Team Member')).toBeInTheDocument();
      expect(getByText('Team Admin')).toBeInTheDocument();
      expect(getByText('Stakeholder')).toBeInTheDocument();
    });
  });
});
