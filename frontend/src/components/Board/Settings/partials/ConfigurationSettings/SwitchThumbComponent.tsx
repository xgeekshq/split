import Icon from '@/components/icons/Icon';
import { SwitchThumb } from '@/components/Primitives/Switch';

type Props = {
  isChecked: boolean;
  iconName: string;
  color: string | undefined;
};

const SwitchThumbComponent = ({ isChecked, iconName, color }: Props) => (
  <SwitchThumb variant="sm">
    {isChecked && (
      <Icon
        name={iconName}
        css={{
          width: '$10',
          height: '$10',
          color: color || '$successBase',
        }}
      />
    )}
  </SwitchThumb>
);

export default SwitchThumbComponent;
