import Icon from '@/components/Primitives/Icon';
import { DialogClose } from '@radix-ui/react-dialog';
import { StyledDialogTitle } from './styles';
import Button from '../../Button/Button';
import Flex from '../../Layout/Flex';
import Text from '../../Text';

type HeaderProps = {
  title: string;
};

const DialogHeader = ({ title }: HeaderProps) => (
  <StyledDialogTitle>
    <Flex css={{ flex: 1 }}>
      <Text heading="4">{title}</Text>
    </Flex>
    <DialogClose asChild>
      <Button isIcon size="md">
        <Icon css={{ color: '$primary400' }} name="close" />
      </Button>
    </DialogClose>
  </StyledDialogTitle>
);

export default DialogHeader;
