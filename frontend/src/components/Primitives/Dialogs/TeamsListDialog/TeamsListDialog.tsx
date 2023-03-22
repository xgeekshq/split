import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { TeamChecked } from '@/types/team/team';
import SearchInput from '../../Inputs/SearchInput/SearchInput';
import Flex from '../../Layout/Flex/Flex';
import Dialog from '../Dialog/Dialog';
import Text from '../../Text/Text';
import Separator from '../../Separator/Separator';
import Checkbox from '../../Inputs/Checkboxes/Checkbox/Checkbox';

type TeamListDialogProps = {
  teamList: TeamChecked[];
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  handleAddTeams: (updatedTeams: TeamChecked[]) => void;
};

const TeamsListDialog = ({ teamList, isOpen, setIsOpen, handleAddTeams }: TeamListDialogProps) => {
  const [teams, setTeams] = useState<TeamChecked[]>([]);
  const [search, setSearch] = useState<string>('');

  // Filter Teams
  const filteredTeams = useMemo(() => {
    const input = search.toLowerCase().trim();

    if (!input) {
      return teams;
    }

    return teams.filter((team) => team.name.toLowerCase().trim().includes(input));
  }, [search, teams]);

  // Checks Teams
  const handleChecked = (id: string) => {
    const updateCheckedTeams = teams.map((team) =>
      team._id === id ? { ...team, isChecked: !team.isChecked } : team,
    );

    setTeams(updateCheckedTeams);
  };

  const saveUpdatedTeams = () => {
    const checkedTeams = teams.filter((t) => t.isChecked);
    handleAddTeams(checkedTeams);
  };

  useEffect(() => {
    if (teamList) setTeams(teamList);
  }, [teamList]);

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
          {filteredTeams?.map((team) => (
            <Flex key={team._id} align="center">
              <Flex css={{ flex: 1 }}>
                <Checkbox
                  checked={team.isChecked}
                  size="md"
                  id={team._id}
                  label={team.name}
                  handleChange={() => handleChecked(team._id)}
                />
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
      <Dialog.Footer
        handleAffirmative={saveUpdatedTeams}
        handleClose={() => setIsOpen(false)}
        affirmativeLabel="Add"
      />
    </Dialog>
  );
};

export default TeamsListDialog;
