import React from 'react';
import { SetterOrUpdater, useRecoilValue } from 'recoil';
import { styled } from '@/styles/stitches/stitches.config';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Box from '@/components/Primitives/Layout/Box';
import Checkbox from '@/components/Primitives/Checkbox/Checkbox';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import Tooltip from '@/components/Primitives/Tooltip/Tooltip';
import useCreateBoard from '@/hooks/useCreateBoard';
import { CreateBoardData, createBoardError } from '@/store/createBoard/atoms/create-board.atom';
import { BoardToAdd } from '@/types/board/board';
import { Team } from '@/types/team/team';
import Flex from '@/components/Primitives/Layout/Flex';
import AvatarGroup from '@/components/Primitives/Avatars/AvatarGroup/AvatarGroup';
import { useFormContext, useWatch } from 'react-hook-form';
import SubCardBoard from './SubCardBoard';

const MainContainer = styled(Flex, Box, {});

interface SubBoardListProp {
  dividedBoards: BoardToAdd[];
  setBoard: SetterOrUpdater<CreateBoardData>;
}

interface MainBoardCardInterface {
  team: Team;
}

const SubBoardList = React.memo(({ dividedBoards, setBoard }: SubBoardListProp) => (
  <Flex css={{ mb: '$50' }} direction="column" gap="8">
    {dividedBoards.map((subBoard, index) => (
      <SubCardBoard key={subBoard.title} board={subBoard} index={index} setBoard={setBoard} />
    ))}
  </Flex>
));

const MainBoardCard = React.memo(({ team }: MainBoardCardInterface) => {
  /**
   * Recoil Atoms
   */
  const haveError = useRecoilValue(createBoardError);

  const { setValue, control } = useFormContext();

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
    <Flex css={{ width: '100%', height: '100%' }} direction="column" gap="8">
      <MainContainer
        align="center"
        elevation="1"
        justify="between"
        css={{
          backgroundColor: 'white',
          height: '$76',
          width: '100%',
          borderRadius: '$12',
          px: '$24',
          py: '$22',
        }}
      >
        <Flex>
          <Flex align="center" gap="8">
            <Tooltip content="It’s a main board. All sub-team boards got merged into this main board.">
              <div>
                <Icon css={{ width: '31px', height: '$32' }} name="blob-split" />
              </div>
            </Tooltip>
            <Text heading="6">{board.title}</Text>
          </Flex>
          <Flex align="center" css={{ ml: '$40' }}>
            <Text color="primary300" css={{ mr: '$8' }} size="sm">
              Sub-teams/-boards
            </Text>
            <Separator orientation="vertical" size="md" />
            <Text css={{ ml: '$8' }}>{board.dividedBoards.length}</Text>
            <Flex css={{ ml: '$12' }} gap="4">
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
                    backgroundColor: canReduce ? '$primary100' : 'white',
                  },
                }}
                onClick={handleRemoveTeam}
              >
                <Icon
                  name="minus"
                  css={{
                    width: '$10',
                    height: '$1',
                  }}
                />
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
                    backgroundColor: canAdd ? '$primary100' : 'white',
                  },
                }}
                onClick={handleAddTeam}
              >
                <Icon
                  name="plus"
                  css={{
                    width: '$12',
                    height: '$12',
                  }}
                />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex align="center" gap="8">
          <Text size="sm" fontWeight="medium">
            {team.name}
          </Text>
          <AvatarGroup
            haveError={haveError}
            listUsers={team.users}
            responsible={false}
            teamAdmins={false}
            userId="1"
          />
        </Flex>
      </MainContainer>
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

export default MainBoardCard;
