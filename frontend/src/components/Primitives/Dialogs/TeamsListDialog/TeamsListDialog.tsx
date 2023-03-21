import { Dispatch, SetStateAction, useState } from 'react';
import SearchInput from '../../Inputs/SearchInput/SearchInput';
import Flex from '../../Layout/Flex/Flex';
import Dialog from '../Dialog/Dialog';
import Text from '../../Text/Text';
import Separator from '../../Separator/Separator';

type TeamListDialogProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  handleAddTeams: () => void;
  handleClose: () => void;
};

const TeamListDialog = ({
  isOpen,
  setIsOpen,
  handleAddTeams,
  handleClose,
}: TeamListDialogProps) => {
  const [search, setSearch] = useState<string>('');

  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
      <Dialog.Header title="Add new team" />
      <Flex css={{ p: '$32' }} direction="column">
        <SearchInput
          currentValue={search}
          handleChange={(e) => {
            setSearch(e.target.value);
          }}
          handleClear={() => {
            setSearch('');
          }}
          placeholder="Search team"
        />
      </Flex>
      <Text css={{ display: 'block', px: '$32', pb: '$24' }} heading="4">
        Teams
      </Text>
      <Flex direction="column" gap={8}>
        <Flex align="center" css={{ px: '$32' }}>
          <Flex css={{ flex: 1, ml: '$24' }}>
            <Text heading={5}>Name</Text>
          </Flex>
        </Flex>
        <Separator orientation="horizontal" />
      </Flex>
      <Flex
        direction="column"
        justify="start"
        css={{ height: '100%', overflowY: 'auto', py: '$16' }}
      >
        <Flex css={{ px: '$32' }} direction="column" gap={20}>
          List
        </Flex>
      </Flex>
      <Dialog.Footer
        handleAffirmative={handleAddTeams}
        handleClose={handleClose}
        affirmativeLabel="Add"
      />
    </Dialog>
  );
};

export default TeamListDialog;
