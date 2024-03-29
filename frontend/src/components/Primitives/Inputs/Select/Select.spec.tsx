// TODO: Test Select Options

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectTrigger,
  SelectValue,
} from '@/components/Primitives/Inputs/Select/Select';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';

const DUMMY_OPTIONS = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Banana', value: 'Banana' },
  { label: 'Blueberry', value: 'Blueberry' },
  { label: 'Grapes', value: 'Grapes' },
  { label: 'Pineapple', value: 'Pineapple' },
];

const render = (disabled = false) =>
  renderWithProviders(
    <Select disabled={disabled}>
      <SelectTrigger css={{ padding: '$24' }}>
        <Flex direction="column">
          <Text color="primary300" size="md">
            Choose a fruit
          </Text>
          <SelectValue />
        </Flex>
        <SelectIcon className="SelectIcon">
          <Icon name="arrow-down" />
        </SelectIcon>
      </SelectTrigger>
      <SelectContent options={DUMMY_OPTIONS} />
    </Select>,
  );

describe('Components/Primitives/Inputs/Select', () => {
  it('should render correctly', () => {
    // Act
    const { getByTestId } = render();

    // Assert
    expect(getByTestId('select')).toBeInTheDocument();
  });

  it('should render placeholder correctly', () => {
    // Act
    const { getByTestId, getByText } = render();

    // Assert
    expect(getByTestId('select')).toBeInTheDocument();
    expect(getByText('Choose a fruit')).toBeInTheDocument();
  });
});
