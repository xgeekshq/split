import { StyledDialogTitle } from '@/components/Board/Settings/styles';
import Icon from '@/components/icons/Icon';
import { DialogClose } from '@radix-ui/react-dialog';
import Button from '../Button';
import Flex from '../Flex';

const DialogHeader: React.FC = ({ children }) => (
  <StyledDialogTitle>
    <Flex css={{ flex: 1 }}>{children}</Flex>
    <DialogClose asChild>
      <Button isIcon size="md">
        <Icon css={{ color: '$primary400' }} name="close" />
      </Button>
    </DialogClose>
  </StyledDialogTitle>
);

export default DialogHeader;
