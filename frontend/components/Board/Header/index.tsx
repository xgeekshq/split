import RecurrentIcon from "../../icons/Recurrent";
import Text from "../../Primitives/Text";
import LogoIcon from "../../icons/Logo";
import {
  BoardCounter,
  MergeIconContainer,
  StyledHeader,
  StyledLogo,
  StyledPopoverArrow,
  StyledPopoverContent,
  StyledPopoverItem,
  TitleSection,
} from "./styles";
import Tooltip from "../../Primitives/Tooltip";
import BoardBreadcrumb from "../Breadcrumb";
import { boardState } from "../../../store/board/atoms/board.atom";
import { useRecoilValue } from "recoil";
import CardAvatars from "../../CardBoard/CardAvatars";
import { useSession } from "next-auth/react";
import MergeIcon from "../../icons/Merge";
import Flex from "../../Primitives/Flex";
import Separator from "../../Primitives/Separator";
import InfoIcon from "../../icons/Info";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";

const BoardHeader = () => {
  const { data: session } = useSession({ required: true });

  const boardData = useRecoilValue(boardState);

  const { title, recurrent, users, team, dividedBoards, isSubBoard, submitedAt } = boardData!.board;

  return (
    <StyledHeader>
      <Flex align="center" justify="between" gap="20">
        <Flex direction="column">
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

            {isSubBoard && !submitedAt && (
              <Tooltip content="Unmerged">
                <MergeIconContainer isMerged={!!submitedAt}>
                  <MergeIcon />
                </MergeIconContainer>
              </Tooltip>
            )}
          </TitleSection>
        </Flex>

        <Flex align="center" gap="24">
          <Flex align="center" gap="10">
            <Text color="primary800" size="sm" css={{ fontWeight: 500 }}>
              {isSubBoard ? title.replace("board", "") : team.name}
            </Text>
            <CardAvatars
              listUsers={users}
              responsible={false}
              teamAdmins={false}
              userId={session!.user.id}
            />
          </Flex>

          {(boardData!.board.users || users).filter((user) => user.role === "stakeholder").length >
            0 && (
            <>
              <Separator data-orientation="vertical" css={{ height: "$24 !important" }} />

              <Flex align="center" gap="10">
                <Text color="primary300" size="sm">
                  Stakeholders
                </Text>
                <CardAvatars
                  listUsers={users}
                  responsible={false}
                  teamAdmins={false}
                  stakeholders={true}
                  userId={session!.user.id}
                />
              </Flex>
            </>
          )}
        </Flex>
      </Flex>

      {!isSubBoard && (
        <Popover>
          <PopoverTrigger asChild>
            <BoardCounter>
              <InfoIcon /> {dividedBoards.filter((dividedBoard) => dividedBoard.submitedAt).length}{" "}
              of {dividedBoards.length} sub-team boards merged
            </BoardCounter>
          </PopoverTrigger>
          <StyledPopoverContent>
            <Flex direction={"column"}>
              {dividedBoards.map((board) => (
                <StyledPopoverItem key={board.title.toLowerCase().split(" ").join("-")}>
                  <p>{board.title}</p>

                  <div>
                    {board.submitedAt ? "Merged" : "Unmerged"}
                    <MergeIconContainer isMerged={!!board.submitedAt}>
                      <MergeIcon />
                    </MergeIconContainer>{" "}
                  </div>
                </StyledPopoverItem>
              ))}
            </Flex>

            <StyledPopoverArrow />
          </StyledPopoverContent>
        </Popover>
      )}
    </StyledHeader>
  );
};

export default BoardHeader;
