import { ButtonsContainer } from '@/components/Board/Settings/styles';
import Button from '../Button';

type FooterProps = {
  affirmativeLabel?: string;
  handleAffirmative?: () => void;
  setIsOpen: (isOpen: boolean) => void;
  buttonRef?: React.RefObject<HTMLButtonElement>;
  showSeparator?: boolean;
};

const Footer: React.FC<FooterProps> = (props) => {
  const {
    children,
    handleAffirmative,
    setIsOpen,
    affirmativeLabel,
    buttonRef,
    showSeparator = true,
  } = props;

  return (
    <ButtonsContainer
      gap={24}
      align="center"
      justify="end"
      css={{
        backgroundColor: '$white',
        borderTop: showSeparator ? '1px solid $colors$primary100' : 'none',
      }}
    >
      {children}
      <Button variant="primaryOutline" onClick={() => setIsOpen(false)} type="button">
        Cancel
      </Button>
      {(handleAffirmative || affirmativeLabel) && (
        <Button onClick={handleAffirmative} ref={buttonRef}>
          {affirmativeLabel}
        </Button>
      )}
    </ButtonsContainer>
  );
};

export default Footer;
