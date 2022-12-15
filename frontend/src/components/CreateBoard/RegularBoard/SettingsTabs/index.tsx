import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Flex from '@/components/Primitives/Flex';
import Separator from '@/components/Primitives/Separator';
import { createBoardError } from '@/store/createBoard/atoms/create-board.atom';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { toastState } from '@/store/toast/atom/toast.atom';
import Text from '@/components/Primitives/Text';
import { StyledTextTab } from './styles';
import SettingsParticipant from '../SettingsParticipant';

const SettingsTabs = () => {
  const [currentTab, setCurrentTab] = useState(1);
  // const [timesOpen, setTimesOpen] = useState<number>(0);

  /**
   * Recoil Atoms
   */
  const haveError = useRecoilValue(createBoardError);
  const setToastState = useSetRecoilState(toastState);

  const handleChangeTab = (value: number) => {
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
      <Text heading={3} css={{ mb: '$8', mt: '$12' }}>
        Settings
      </Text>
      <Flex css={{ width: '100%' }} gap="24">
        <StyledTextTab
          color="primary300"
          data-activetab={currentTab === 1}
          size="md"
          onClick={!haveError ? () => handleChangeTab(1) : undefined}
        >
          Participants
        </StyledTextTab>
        <StyledTextTab
          color="primary300"
          data-activetab={currentTab === 2}
          size="md"
          onClick={!haveError ? () => handleChangeTab(2) : undefined}
        >
          Configurations
        </StyledTextTab>
      </Flex>
      <Separator
        css={{ position: 'relative', top: '-1px', zIndex: '-1' }}
        orientation="horizontal"
      />

      {currentTab === 1 && <SettingsParticipant />}
      {/* {currentTab === 2 && <BoardConfigurations />} */}
    </Flex>
  );
};

export default SettingsTabs;
