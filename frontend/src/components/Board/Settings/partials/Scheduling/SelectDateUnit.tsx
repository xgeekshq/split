import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import DatePicker from '@components/Primitives/DatePicker/DatePicker';
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
  currentDate?: Date;
  setDate: (date: Date) => void;
  setCheckboxState: (value: boolean) => void;
};

const SelectDateUnit = ({
  isChecked,
  title,
  description,
  currentDate,
  setCheckboxState,
  setDate,
}: RepeatProps) => {
  return (
    <>
      <Text fontWeight="medium">{title}</Text>
      <Text>{description}</Text>
      <Flex
        direction="row"
        gap={16}
        style={{
          maxHeight: '100%',
        }}
      >
        <Checkbox
          checked={isChecked}
          id="repeatCheckbox"
          size="md"
          handleChange={() => {
            setCheckboxState(!isChecked);
          }}
        />

        <DatePicker currentDate={currentDate} disabled={!isChecked} setDate={setDate} />

        <Select css={{ width: '50%', height: '$60' }} disabled={!isChecked}>
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
