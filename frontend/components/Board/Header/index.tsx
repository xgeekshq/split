import RecurrentIcon from "../../icons/Recurrent";
import Text from "../../Primitives/Text";
import LogoIcon from "../../icons/Logo";
import { StyledHeader, StyledLogo, TitleSection } from "./styles";
import Tooltip from "../../Primitives/Tooltip";
import BoardBreadcrumb from "../Breadcrumb";

type Props = {
  board: {
    title: string;
    recurrent?: boolean;
  };
};

const BoardHeader = ({ board }: Props) => {
  const items = [
    {
      title: "Boards",
      link: "/boards",
    },
    {
      title: board.title,
      isActive: true,
    },
  ];

  return (
    <StyledHeader>
      <BoardBreadcrumb items={items} />
      <TitleSection>
        <StyledLogo>
          <LogoIcon />
        </StyledLogo>
        <Text heading="2">{board.title}</Text>

        {board.recurrent && (
          <Tooltip content="Occurs every X week">
            <div>
              <RecurrentIcon />
            </div>
          </Tooltip>
        )}
      </TitleSection>
    </StyledHeader>
  );
};

export default BoardHeader;
