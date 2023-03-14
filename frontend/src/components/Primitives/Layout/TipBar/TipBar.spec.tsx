import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import TipBar, { TipBarProps } from './TipBar';

const DEFAULT_PROPS: TipBarProps = {
  tips: [
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
  ],
};

const render = (props: TipBarProps) => renderWithProviders(<TipBar {...props} />);

describe('Components/Primitives/Layout/TipBar', () => {
  it('should render correctly', () => {
    // Arrange
    const tipBarProps: TipBarProps = { ...DEFAULT_PROPS };

    // Act
    const { getByTestId, getAllByTestId, getAllByRole } = render(tipBarProps);
    const tipIcon = getByTestId('tipbar').querySelector('svg > use');
    const tipList = getAllByRole('listbox');

    // Assert
    expect(getByTestId('tipbar')).toBeInTheDocument();

    if (tipBarProps.iconName) {
      expect(tipIcon).toHaveAttribute('href', `#${tipBarProps.iconName}`);
    } else {
      expect(tipIcon).toHaveAttribute('href', `#blob-idea`);
    }

    expect(tipList).toHaveLength(tipBarProps.tips.length);

    const tipTitles = getAllByTestId('tipbarTitle').map((item) => item.textContent);
    expect(tipTitles).toEqual(tipBarProps.tips.map((item) => item.title));

    const tipDescriptions = getAllByTestId('tipbarDescription').map((item) => item.textContent);
    expect(tipDescriptions).toEqual(tipBarProps.tips.flatMap((item) => item.description));
  });
});
