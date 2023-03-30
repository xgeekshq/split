import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { SetterOrUpdater, useRecoilValue } from 'recoil';

import AvatarGroup from '@/components/Primitives/Avatars/AvatarGroup/AvatarGroup';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Checkbox from '@/components/Primitives/Inputs/Checkboxes/Checkbox/Checkbox';
import Box from '@/components/Primitives/Layout/Box/Box';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';
import useCreateBoard from '@/hooks/useCreateBoard';
import { CreateBoardData, createBoardError } from '@/store/createBoard/atoms/create-board.atom';
import { BoardToAdd } from '@/types/board/board';
import { Team } from '@/types/team/team';

import CreateSubBoardItem from './CreateSubBoardItem/CreateSubBoardItem';
import { StyledMainBoardItem } from './styles';

interface SubBoardListProp {
  dividedBoards: BoardToAdd[];
  setBoard: SetterOrUpdater<CreateBoardData>;
}

interface CreateBoardItemInterface {
  team: Team;
}

const SubBoardList = React.memo(({ dividedBoards, setBoard }: SubBoardListProp) => (
  <Flex css={{ mb: '$50' }} direction="column" gap={8}>
    {dividedBoards.map((subBoard, index) => (
      <CreateSubBoardItem key={subBoard.title} board={subBoard} index={index} setBoard={setBoard} />
    ))}
  </Flex>
));

const CreateBoardItem = React.memo(({ team }: CreateBoardItemInterface) => {
  const haveError = useRecoilValue(createBoardError);
  const { setValue, watch, control } = useFormContext();
  const boardName = watch('text');

  const slackEnable = useWatch({
    control,
    name: 'slackEnable',
  });

  const {
    handleAddTeam,
    handleRemoveTeam,
    createBoardData: { board },
    setCreateBoardData,
    canAdd,
    canReduce,
  } = useCreateBoard(team);

  return (
    <Flex css={{ width: '100%', height: '100%' }} direction="column" gap={8}>
      <StyledMainBoardItem align="center" elevation="1" justify="between" gap={24}>
        <Flex align="center" gap={8} css={{ flex: 2 }}>
          <Tooltip content="It’s a main board. All sub-team boards got merged into this main board.">
            <div>
              <Icon size={32} name="blob-split" />
            </div>
          </Tooltip>
          <Text heading="6">{boardName.length > 0 ? boardName : board.title}</Text>
        </Flex>
        <Flex align="center" css={{ flex: 2 }} gap={12}>
          <Flex align="center" gap={8}>
            <Text color="primary300" size="sm">
              Sub-teams/-boards
            </Text>
            <Separator orientation="vertical" size="md" />
            <Text>{board.dividedBoards.length}</Text>
          </Flex>
          <Flex gap={4}>
            <Flex
              align="center"
              justify="center"
              css={{
                width: '$24',
                height: '$24',
                borderRadius: '$round',
                border: `1px solid ${!canReduce ? '$colors$primary200' : '$colors$primary400'}`,
                color: !canReduce ? '$colors$primary200' : '$colors$primary400',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  cursor: canReduce ? 'pointer' : 'default',
                  backgroundColor: canReduce ? '$primary100' : '$white',
                },
              }}
              onClick={handleRemoveTeam}
            >
              <Icon name="minus" size={12} />
            </Flex>
            <Flex
              align="center"
              justify="center"
              css={{
                width: '$24',
                height: '$24',
                borderRadius: '$round',
                border: `1px solid ${!canAdd ? '$primary200' : '$primary400'}`,
                color: !canAdd ? '$primary200' : '$primary400',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  cursor: canAdd ? 'pointer' : 'default',
                  backgroundColor: canAdd ? '$primary100' : '$white',
                },
              }}
              onClick={handleAddTeam}
            >
              <Icon name="plus" size={12} />
            </Flex>
          </Flex>
        </Flex>
        <Flex align="center" justify="end" gap="8" css={{ flex: 3 }}>
          <Text size="sm" fontWeight="medium">
            {team.name}
          </Text>
          <AvatarGroup haveError={haveError} listUsers={team.users} userId="1" />
        </Flex>
      </StyledMainBoardItem>
      <SubBoardList dividedBoards={board.dividedBoards} setBoard={setCreateBoardData} />
      <Box>
        <Checkbox
          id="slackEnable"
          label="Create Slack group for each sub-team"
          size="md"
          checked={slackEnable}
          handleChange={(checked) => {
            setValue('slackEnable', checked);
          }}
        />
      </Box>
    </Flex>
  );
});

export default CreateBoardItem;
