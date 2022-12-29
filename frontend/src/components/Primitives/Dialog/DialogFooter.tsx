import { ButtonsContainer } from '@/components/Board/Settings/styles';
import Button from '../Button';

type FooterProps = {
  affirmativeLabel?: string;
  handleAffirmative?: () => void;
  setIsOpen: (isOpen: boolean) => void;
};

const Footer: React.FC<FooterProps> = (props) => {
  const { children, handleAffirmative, setIsOpen, affirmativeLabel } = props;

  return (
    <ButtonsContainer gap={24} align="center" justify="end">
      {children}
      <Button
        css={{ margin: '0 $24 0 auto', padding: '$16 $24' }}
        variant="primaryOutline"
        onClick={() => setIsOpen(false)}
      >
        Cancel
      </Button>
      {handleAffirmative && affirmativeLabel && (
        <Button
          css={{ marginRight: '$32', padding: '$16 $24' }}
          variant="primary"
          onClick={handleAffirmative}
        >
          {affirmativeLabel}
        </Button>
      )}
    </ButtonsContainer>
  );
};

export default Footer;
