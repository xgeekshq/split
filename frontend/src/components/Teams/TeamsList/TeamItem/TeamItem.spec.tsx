import { createMockRouter } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { TeamFactory } from '@/utils/factories/team';
import TeamItem, { TeamItemProps } from './index';

const DEFAULT_PROPS = {
  userId: '',
  team: TeamFactory.create(),
};

const router = createMockRouter({ pathname: '/teams' });

jest.mock('next/router', () => ({
  useRouter: () => router,
}));

const render = (props: TeamItemProps = DEFAULT_PROPS) =>
  renderWithProviders(<TeamItem {...props} />, { routerOptions: router });

describe('Components/TeamItem', () => {
  it('should render correctly', () => {
    // Arrange
    const teamItemProps = { ...DEFAULT_PROPS };

    // Act
    const { getByTestId } = render(teamItemProps);

    // Assert
    expect(getByTestId('teamitemTitle')).toBeInTheDocument();
  });
});
