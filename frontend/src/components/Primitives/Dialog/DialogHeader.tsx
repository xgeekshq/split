import { StyledDialogCloseButton, StyledDialogTitle } from '@/components/Board/Settings/styles';
import Icon from '@/components/icons/Icon';
import { DialogClose } from '@radix-ui/react-dialog';
import Flex from '../Flex';

const DialogHeader: React.FC = ({ children }) => (
  <StyledDialogTitle>
    <Flex css={{ flex: 1 }}>{children}</Flex>
    <DialogClose asChild>
      <StyledDialogCloseButton isIcon size="lg">
        <Icon css={{ color: '$primary400' }} name="close" size={24} />
      </StyledDialogCloseButton>
    </DialogClose>
  </StyledDialogTitle>
);

export default DialogHeader;
