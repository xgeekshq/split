import React from 'react';
import { createMockRouter } from '@/utils/testing/mocks';
import { fireEvent } from '@testing-library/react';
import { TeamFactory } from '@/utils/factories/team';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import PopoverRoleSettings, { PopoverRoleSettingsProps } from './PopoverRoleSettings';

const router = createMockRouter({ pathname: '/teams' });

jest.mock('next/router', () => ({
  useRouter: () => router,
}));

const render = (props: PopoverRoleSettingsProps) =>
  renderWithProviders(<PopoverRoleSettings {...props} />, { routerOptions: router });

describe('Components/Teams/Team/TeamMemberItem/PopoverRoleSettings', () => {
  it('should render correctly', () => {
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
    expect(getByText('Team Member')).toBeInTheDocument();
    expect(getByText('Team Admin')).toBeInTheDocument();
    expect(getByText('Stakeholder')).toBeInTheDocument();
  });
});
