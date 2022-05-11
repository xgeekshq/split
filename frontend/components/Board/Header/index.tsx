import RecurrentIcon from "../../icons/Recurrent";
import Text from "../../Primitives/Text";
import LogoIcon from "../../icons/Logo";
import { FlexSection, StyledHeader, StyledLogo, TitleSection } from "./styles";
import Tooltip from "../../Primitives/Tooltip";
import BoardBreadcrumb from "../Breadcrumb";
import { boardState } from "../../../store/board/atoms/board.atom";
import { useRecoilValue } from "recoil";
import CardAvatars from "../../CardBoard/CardAvatars";
import { useSession } from "next-auth/react";

const BoardHeader = () => {
  const { data: session } = useSession({ required: true });

  const boardData = useRecoilValue(boardState);
  const { title, recurrent, users, team, isSubBoard } = boardData!.board;

  return (
    <StyledHeader>
      <FlexSection>
        <div>
          <BoardBreadcrumb />
          <TitleSection>
            <StyledLogo>
              <LogoIcon />
            </StyledLogo>
            <Text heading="2">{title}</Text>

            {recurrent && (
              <Tooltip content="Occurs every X week">
                <div>
                  <RecurrentIcon />
                </div>
              </Tooltip>
            )}
          </TitleSection>
        </div>

        <CardAvatars
          listUsers={
            isSubBoard && boardData?.mainBoardData
              ? boardData!.mainBoardData?.team.users
              : team.users
          }
          responsible={false}
          teamAdmins={false}
          userId={session!.user.id}
        />
      </FlexSection>
    </StyledHeader>
  );
};

export default BoardHeader;
