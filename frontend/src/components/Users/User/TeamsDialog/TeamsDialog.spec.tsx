import { createMockRouter, libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { UserFactory } from '@/utils/factories/user';
import { fireEvent, waitFor } from '@testing-library/react';
import TeamsDialog, { TeamsDialogProps } from '@/components/Users/User/TeamsDialog/TeamsDialog';
import { TeamCheckedFactory } from '@/utils/factories/team';
import React from 'react';

const router = createMockRouter({});

const render = (props: Partial<TeamsDialogProps> = {}) =>
  renderWithProviders(
    <TeamsDialog
      teamsList={TeamCheckedFactory.createMany(3)}
      setIsOpen={jest.fn()}
      isOpen
      confirmationLabel="confirm"
      title="Title"
      joinedAt={UserFactory.create().joinedAt}
      {...props}
    />,
    { routerOptions: router },
  );

describe('Components/Users/User/TeamsDialog', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    // Arrange
    const teamsList = TeamCheckedFactory.createMany(3);

    // Act
    const { getAllByTestId, getByTestId } = render({ teamsList });

    // Assert
    expect(getAllByTestId('checkboxTeamItem')).toHaveLength(teamsList.length);
    expect(getByTestId('searchInput')).toBeInTheDocument();
  });

  it('should call confirmationHandler function', async () => {
    // Arrange
    const udateUserTeamsMutation = jest.fn();
    libraryMocks.mockReactQuery({ useMutationResult: { mutate: udateUserTeamsMutation } });

    const teamsList = TeamCheckedFactory.createMany(3, [
      { isChecked: false },
      { isChecked: true },
      { isChecked: false },
    ]);

    // Act
    const { getByTestId } = render({ teamsList });

    fireEvent.click(getByTestId('dialogFooterSubmit'));

    // Assert
    await waitFor(() => {
      expect(udateUserTeamsMutation).toBeCalled();
    });
  });
});
