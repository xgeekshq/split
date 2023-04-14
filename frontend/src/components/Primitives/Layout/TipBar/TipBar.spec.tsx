import TipBar, { TipBarProps } from '@/components/Primitives/Layout/TipBar/TipBar';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const DUMMY_TIPS = [
  {
    title: 'Lorem Ipsum',
    description: [
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad porro similique perspiciatis tempora.',
      'Libero animi quis dolores vitae maiores similique quam velit. Sapiente quas ipsam blanditiis ratione, corporis laborum in?',
    ],
  },
  {
    title: 'Lorem Ipsum 1',
    description: [
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad porro similique perspiciatis tempora.',
      'Libero animi quis dolores vitae maiores similique quam velit. Sapiente quas ipsam blanditiis ratione, corporis laborum in?',
    ],
  },
];

const render = (props: Partial<TipBarProps> = {}) =>
  renderWithProviders(<TipBar tips={DUMMY_TIPS} {...props} />);

describe('Components/Primitives/Layout/TipBar', () => {
  it('should render correctly', () => {
    // Arrange
    const iconName = 'blob-idea';

    // Act
    const { getByTestId, getAllByTestId, getAllByRole } = render({ iconName });
    const tipIcon = getByTestId('tipbar').querySelector('svg > use');
    const tipList = getAllByRole('listbox');

    // Assert
    expect(getByTestId('tipbar')).toBeInTheDocument();

    if (iconName) {
      expect(tipIcon).toHaveAttribute('href', `#${iconName}`);
    } else {
      expect(tipIcon).toHaveAttribute('href', `#blob-idea`);
    }

    expect(tipList).toHaveLength(DUMMY_TIPS.length);

    const tipTitles = getAllByTestId('tipbarTitle').map((item) => item.textContent);
    expect(tipTitles).toEqual(DUMMY_TIPS.map((item) => item.title));

    const tipDescriptions = getAllByTestId('tipbarDescription').map((item) => item.textContent);
    expect(tipDescriptions).toEqual(DUMMY_TIPS.flatMap((item) => item.description));
  });
});
