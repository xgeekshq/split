import Icon from '@/components/Primitives/Icons/Icon/Icon';
import ConfigurationSwitch from '@/components/Primitives/Inputs/Switches/ConfigurationSwitch/ConfigurationSwitch';
import Flex from '@/components/Primitives/Layout/Flex';
import Text from '@/components/Primitives/Text/Text';
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverTrigger,
} from '@/components/Primitives/Popovers/Popover/Popover';

type BoardRolePopoverProps = {
  isNewJoinerHandler: (checked: boolean) => void;
  isNewJoiner: boolean;
  canBeResponsibleHandler: (checked: boolean) => void;
  canBeResponsible: boolean;
};

const BoardRolePopover = ({
  isNewJoinerHandler,
  isNewJoiner,
  canBeResponsibleHandler,
  canBeResponsible,
}: BoardRolePopoverProps) => (
  <Flex align="center" gap={8} data-testid="boardRolePopover">
    <Text fontWeight="medium" size="sm">
      Board role
    </Text>
    <Popover>
      <PopoverTrigger variant="dark" size="sm" data-testid="teamRolePopoverTrigger">
        <Icon name="arrow-down" />
      </PopoverTrigger>
      <PopoverContent collisionPadding={32} onOpenAutoFocus={(e) => e.preventDefault()}>
        <PopoverItem>
          <ConfigurationSwitch
            handleCheckedChange={isNewJoinerHandler}
            isChecked={isNewJoiner}
            title="New Joiner"
            disabled={canBeResponsible}
          />
        </PopoverItem>
        <PopoverItem>
          <ConfigurationSwitch
            handleCheckedChange={canBeResponsibleHandler}
            isChecked={canBeResponsible}
            title="Responsible allowed"
            disabled={isNewJoiner}
          />
        </PopoverItem>
      </PopoverContent>
    </Popover>
  </Flex>
);

export default BoardRolePopover;
