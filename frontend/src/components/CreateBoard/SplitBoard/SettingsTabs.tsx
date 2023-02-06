import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { styled } from '@/styles/stitches/stitches.config';

import Flex from '@/components/Primitives/Flex';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import { createBoardError, createBoardTeam } from '@/store/createBoard/atoms/create-board.atom';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { toastState } from '@/store/toast/atom/toast.atom';
import { usePrevious } from '@/utils/previousState';
import BoardConfigurations from '../Configurations/BoardConfigurations';
import TeamSubTeamsConfigurations from './SubTeamsTab/TeamSubTeamsConfigurations';

const StyledTextTab = styled(Text, {
  pb: '$12 !important',
  lineHeight: '$20',
  '&:hover': {
    cursor: 'pointer',
  },
  '&[data-activetab="true"]': {
    boxSizing: 'border-box',
    borderBottom: '2px solid $colors$primary800',
    fontWeight: '$bold',
    fontSize: '$16',
    letterSpacing: '$0-2',
    color: '$primary800',
  },
});

const Settings = () => {
  const [currentTab, setCurrentTab] = useState(1);

  /**
   * Recoil Atoms
   */
  const haveError = useRecoilValue(createBoardError);
  const setToastState = useSetRecoilState(toastState);
  const selectedTeam = useRecoilValue(createBoardTeam);
  const prevTeam = usePrevious(selectedTeam?.id);

  const handleChangeTab = (value: number) => {
    if (haveError) return;
    setCurrentTab(value);
  };

  const {
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (errors.maxVotes) {
      setCurrentTab(2);
    }

    if (errors.team && currentTab === 2) {
      setToastState({
        open: true,
        content: 'Please choose a team in the "Team/-Sub-teams configuration" tab',
        type: ToastStateEnum.ERROR,
      });
    }
  }, [currentTab, errors.maxVotes, errors.team, setToastState]);

  return (
    <Flex direction="column">
      <Text heading={3} css={{ mb: '$24', mt: '$32' }}>
        Settings
      </Text>
      <Flex css={{ width: '100%', borderBottom: '1px solid $primary200' }} gap="24">
        <StyledTextTab
          css={{ marginBottom: '-1.5px' }}
          color="primary300"
          data-activetab={currentTab === 1}
          size="md"
          onClick={() => handleChangeTab(1)}
        >
          Team/-Sub-teams configurations
        </StyledTextTab>

        <StyledTextTab
          css={{ marginBottom: '-1.5px' }}
          color="primary300"
          data-activetab={currentTab === 2}
          size="md"
          onClick={() => handleChangeTab(2)}
        >
          Configurations
        </StyledTextTab>
      </Flex>
      <Separator css={{ position: 'relative', top: '-1px', zIndex: '-1' }} />
      {currentTab === 1 && <TeamSubTeamsConfigurations previousTeam={prevTeam} />}
      {currentTab === 2 && <BoardConfigurations />}
    </Flex>
  );
};

export default Settings;
