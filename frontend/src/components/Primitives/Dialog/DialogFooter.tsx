import Button from '../Button';
import Flex from '../Flex';

type FooterProps = {
  affirmativeLabel?: string;
  handleAffirmative?: () => void;
  handleClose: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement>;
  showSeparator?: boolean;
};

const Footer = (props: FooterProps) => {
  const {
    handleAffirmative,
    handleClose,
    affirmativeLabel,
    buttonRef,
    showSeparator = true,
  } = props;

  return (
    <Flex
      gap={24}
      align="center"
      justify="end"
      css={{
        borderTop: showSeparator ? '1px solid $colors$primary100' : 'none',
        padding: showSeparator ? '$32' : 'auto',
      }}
    >
      <Button variant="primaryOutline" onClick={handleClose} type="button">
        Cancel
      </Button>
      {(handleAffirmative || affirmativeLabel) && (
        <Button onClick={handleAffirmative} ref={buttonRef}>
          {affirmativeLabel}
        </Button>
      )}
    </Flex>
  );
};

export default Footer;
