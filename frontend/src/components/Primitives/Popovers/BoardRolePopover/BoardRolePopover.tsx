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

export type BoardRolePopoverProps = {
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
      <PopoverTrigger variant="dark" size="sm" data-testid="boardRolePopoverTrigger">
        <Icon name="arrow-down" />
      </PopoverTrigger>
      <PopoverContent collisionPadding={32} onOpenAutoFocus={(e) => e.preventDefault()}>
        <PopoverItem css={{ cursor: 'default !important' }}>
          <ConfigurationSwitch
            handleCheckedChange={isNewJoinerHandler}
            isChecked={isNewJoiner}
            title="New Joiner"
            fontSize="sm"
            disabled={canBeResponsible}
          />
        </PopoverItem>
        <PopoverItem css={{ cursor: 'default !important' }}>
          <ConfigurationSwitch
            handleCheckedChange={canBeResponsibleHandler}
            isChecked={canBeResponsible}
            title="Responsible allowed"
            fontSize="sm"
            disabled={isNewJoiner}
          />
        </PopoverItem>
      </PopoverContent>
    </Popover>
  </Flex>
);

export default BoardRolePopover;
