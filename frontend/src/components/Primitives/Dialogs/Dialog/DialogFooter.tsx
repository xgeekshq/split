import Button from '../../Inputs/Button/Button';
import Flex from '../../Layout/Flex/Flex';

export type FooterProps = {
  affirmativeLabel?: string;
  handleAffirmative?: () => void;
  handleClose: () => void;
  disabled?: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement>;
  showSeparator?: boolean;
};

const Footer = (props: FooterProps) => {
  const {
    handleAffirmative,
    handleClose,
    disabled = false,
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
        padding: '$24 $32',
      }}
    >
      <Button variant="primaryOutline" onClick={handleClose} type="button">
        Cancel
      </Button>
      {affirmativeLabel && (
        <Button
          onClick={handleAffirmative}
          ref={buttonRef}
          data-testid="dialogFooterSubmit"
          disabled={disabled}
        >
          {affirmativeLabel}
        </Button>
      )}
    </Flex>
  );
};

export default Footer;
