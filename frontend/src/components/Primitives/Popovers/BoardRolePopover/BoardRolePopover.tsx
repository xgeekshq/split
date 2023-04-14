import Icon from '@/components/Primitives/Icons/Icon/Icon';
import ConfigurationSwitch from '@/components/Primitives/Inputs/Switches/ConfigurationSwitch/ConfigurationSwitch';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverTrigger,
} from '@/components/Primitives/Popovers/Popover/Popover';
import Text from '@/components/Primitives/Text/Text';

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
  <Flex align="center" data-testid="boardRolePopover" gap={8}>
    <Text fontWeight="medium" size="sm">
      Board role
    </Text>
    <Popover>
      <PopoverTrigger data-testid="boardRolePopoverTrigger" size="sm" variant="dark">
        <Icon name="arrow-down" />
      </PopoverTrigger>
      <PopoverContent collisionPadding={32} onOpenAutoFocus={(e) => e.preventDefault()}>
        <PopoverItem css={{ cursor: 'default !important' }}>
          <ConfigurationSwitch
            disabled={canBeResponsible}
            handleCheckedChange={isNewJoinerHandler}
            isChecked={isNewJoiner}
            size="sm"
            title="New Joiner"
          />
        </PopoverItem>
        <PopoverItem css={{ cursor: 'default !important' }}>
          <ConfigurationSwitch
            disabled={isNewJoiner}
            handleCheckedChange={canBeResponsibleHandler}
            isChecked={canBeResponsible}
            size="sm"
            title="Responsible allowed"
          />
        </PopoverItem>
      </PopoverContent>
    </Popover>
  </Flex>
);

export default BoardRolePopover;
