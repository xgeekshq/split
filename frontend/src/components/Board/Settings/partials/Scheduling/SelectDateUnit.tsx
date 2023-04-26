import { useMemo } from 'react';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import Icon from '@components/Primitives/Icons/Icon/Icon';
import Checkbox from '@components/Primitives/Inputs/Checkboxes/Checkbox/Checkbox';
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectTrigger,
  SelectValue,
} from '@components/Primitives/Inputs/Select/Select';

export type RepeatProps = {
  title: string;
  isChecked: boolean;
  description: string;
  timeRange?: string;
  timeUnit?: string;
  setCheckboxState: (value: boolean) => void;
  setUnitTime: (timeUnit: string) => void;
  setTimeRange: (timeRange: string) => void;
};

const SelectDateUnit = ({
  isChecked,
  title,
  description,
  timeUnit,
  timeRange,
  setUnitTime,
  setCheckboxState,
  setTimeRange,
}: RepeatProps) => {
  const options = useMemo(() => {
    return Array.from({ length: 99 }, (_, i) => {
      const option = i + 1;
      return {
        label: option.toString(),
        value: option.toString(),
      };
    });
  }, []);

  return (
    <>
      <Flex direction="row" gap={16}>
        <Checkbox
          checked={isChecked}
          id="repeatCheckbox"
          size="md"
          handleChange={() => {
            setCheckboxState(!isChecked);
          }}
        />
        <Text fontWeight="medium">{title}</Text>
      </Flex>

      <Text>{description}</Text>
      <Flex
        direction="row"
        gap={16}
        style={{
          maxHeight: '100%',
        }}
      >
        <Select
          css={{ width: '50%', height: '$60' }}
          disabled={!isChecked}
          onValueChange={setTimeRange}
          value={timeRange}
        >
          <SelectTrigger css={{ padding: '$24' }}>
            <Flex direction="column">
              <Text color="primary300">Select time range</Text>
              <SelectValue />
            </Flex>
            <SelectIcon className="SelectIcon">
              <Icon name="arrow-down" />
            </SelectIcon>
          </SelectTrigger>
          <SelectContent options={options} />
        </Select>
        <Select
          css={{ width: '50%', height: '$60' }}
          disabled={!isChecked}
          onValueChange={setUnitTime}
          value={timeUnit}
        >
          <SelectTrigger css={{ padding: '$24' }}>
            <Flex direction="column">
              <Text color="primary300">Select time unit</Text>
              <SelectValue />
            </Flex>
            <SelectIcon className="SelectIcon">
              <Icon name="arrow-down" />
            </SelectIcon>
          </SelectTrigger>
          <SelectContent
            options={[
              {
                label: 'Day',
                value: 'Day',
              },
              {
                label: 'Week',
                value: 'Week',
              },
              {
                label: 'Month',
                value: 'Month',
              },
            ]}
          />
        </Select>
      </Flex>
    </>
  );
};

export { SelectDateUnit };
