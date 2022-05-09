import Text from "../../Primitives/Text";
import LogoIcon from "../../icons/Logo";
import { StyledHeader, StyledLogo, TitleSection } from "./styles";

type Props = {
  board: {
    title: string;
  };
};

const BoardHeader = ({ board }: Props) => {
  return (
    <StyledHeader>
      <TitleSection>
        <StyledLogo>
          <LogoIcon />
        </StyledLogo>
        <Text heading="2">{board.title}</Text>
      </TitleSection>
    </StyledHeader>
  );
};

export default BoardHeader;
