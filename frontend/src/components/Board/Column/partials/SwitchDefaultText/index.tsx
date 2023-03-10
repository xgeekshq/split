import Flex from '@/components/Primitives/Layout/Flex';
import Switch from '@/components/Primitives/Switches/Switch/Switch';

type SwitchDefaultTextProps = {
  isChecked: boolean;
  handleCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
};

const SwitchDefaultText = ({
  isChecked,
  handleCheckedChange,
  disabled = false,
}: SwitchDefaultTextProps) => (
  <Flex css={{ opacity: disabled ? '0.5' : '1' }}>
    <Switch
      checked={isChecked}
      size="xs"
      onCheckedChange={handleCheckedChange}
      disabled={disabled}
    />
  </Flex>
);

export { SwitchDefaultText };
