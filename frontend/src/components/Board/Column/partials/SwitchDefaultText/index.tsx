import Flex from '@/components/Primitives/Flex';
import { Switch, SwitchThumb } from '@/components/Primitives/Switch';

type SwitchDefaultTextProps = {
  isChecked: boolean;
  handleCheckedChange: (checked: boolean) => void;
};

const SwitchDefaultText = ({ isChecked, handleCheckedChange }: SwitchDefaultTextProps) => (
  <Flex gap={20}>
    <Switch checked={isChecked} variant="xs" onCheckedChange={handleCheckedChange}>
      <SwitchThumb variant="xs" />
    </Switch>
  </Flex>
);

export { SwitchDefaultText };
