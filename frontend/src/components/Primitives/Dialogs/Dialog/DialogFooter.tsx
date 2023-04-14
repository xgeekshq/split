import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

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
      align="center"
      gap={24}
      justify="end"
      css={{
        borderTop: showSeparator ? '1px solid $colors$primary100' : 'none',
        padding: '$24 $32',
      }}
    >
      <Button onClick={handleClose} type="button" variant="primaryOutline">
        Cancel
      </Button>
      {affirmativeLabel && (
        <Button
          data-testid="dialogFooterSubmit"
          disabled={disabled}
          onClick={handleAffirmative}
          ref={buttonRef}
        >
          {affirmativeLabel}
        </Button>
      )}
    </Flex>
  );
};

export default Footer;
