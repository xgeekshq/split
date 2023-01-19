import Flex from '@/components/Primitives/Flex';
import { Switch, SwitchThumb } from '@/components/Primitives/Switch';

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
  <Flex gap={20}>
    <Switch
      checked={isChecked}
      variant="xs"
      onCheckedChange={handleCheckedChange}
      disabled={disabled}
    >
      <SwitchThumb variant="xs" />
    </Switch>
  </Flex>
);

export { SwitchDefaultText };
