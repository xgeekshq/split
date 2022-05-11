import { StyledList } from "./styles";
import BreadcrumbItem from "../BreadcrumbItem";
import ChevronRightIcon from "../../icons/ChevronRight";
import { Fragment } from "react";
import { boardState } from "../../../store/board/atoms/board.atom";
import { useRecoilValue } from "recoil";
import { BreadcrumbType } from "../../../types/board/Breadcrum";

const BoardBreadcrumb = () => {
  //Atoms
  const boardData = useRecoilValue(boardState);

  // Get Board Info
  const { title, dividedBoards, recurrent, team, users, isSubBoard } = boardData!.board;

  const breadcrumbItems: BreadcrumbType = [
    {
      title: "Boards",
      link: "/boards",
    },
  ];

  if (isSubBoard && !!boardData?.mainBoardData) {
    const { title: mainTitle, id: mainId } = boardData?.mainBoardData;

    breadcrumbItems.push(
      {
        title: mainTitle,
        link: `/boards/${mainId}`,
      },
      {
        title,
        isActive: true,
      }
    );
  } else {
    breadcrumbItems.push({
      title,
      isActive: true,
    });
  }

  return (
    <StyledList>
      {breadcrumbItems.map((item, key) => (
        <Fragment key={item.title.toLowerCase().split(" ").join("-")}>
          {
            // If not the first item, show the chevron icon
            key != 0 && <ChevronRightIcon css={{ path: { fill: "$primary300" } }} />
          }
          <BreadcrumbItem item={item} />
        </Fragment>
      ))}
    </StyledList>
  );
};

export default BoardBreadcrumb;
