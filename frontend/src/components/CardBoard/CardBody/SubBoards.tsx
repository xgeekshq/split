import React from 'react';

import LeftArrow from '@/components/CardBoard/CardBody/LeftArrow';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import BoardType from '@/types/board/board';

type SubBoardsProps = {
  isDashboard: boolean;
  isSubBoard: boolean | undefined;
  dividedBoards: BoardType[];
  userId: string;
  renderCardBody: (subBoard: BoardType, idx: number) => JSX.Element;
};

const SubBoards = React.memo(
  ({ isSubBoard, isDashboard, dividedBoards, renderCardBody, userId }: SubBoardsProps) => {
    if (isSubBoard || dividedBoards.length <= 0) return null;

    const dashboardSubBoards = dividedBoards.filter((subBoard) =>
      subBoard.users.find((boardUser) => boardUser.user?._id === userId),
    );
    const subBoards = isDashboard ? dashboardSubBoards : dividedBoards;

    return (
      <Flex direction="column" gap="8">
        {subBoards.map((subBoard, idx) => (
          <Flex key={subBoard._id} gap="40">
            <LeftArrow
              index={idx}
              isDashboard={isDashboard}
              isLast={isDashboard || idx === subBoards.length - 1}
            />
            {renderCardBody(subBoard, idx)}
          </Flex>
        ))}
      </Flex>
    );
  },
);

export default SubBoards;
