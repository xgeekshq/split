import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';
import { membersListState, usersListState } from '@/store/team/atom/team.atom';
import { CreateTeamUser } from '@/types/team/team.user';
import useTeam from '@/hooks/useTeam';
import SchemaCreateTeam from '@/schema/schemaCreateTeamForm';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Text from '@/components/Primitives/Text/Text';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import { StyledForm } from '@/styles/pages/boards/newSplitBoard.styles';
import { useSession } from 'next-auth/react';
import TeamMembersList from '@/components/Teams/Team/TeamMembersList';
import Flex from '@/components/Primitives/Layout/Flex';
import TipBar from './partials/TipBar';
import TeamName from './partials/TeamName';
import { ListMembers } from '../Team/ListMembers';
import CreateTeamHeader from './partials/CreateTeamHeader';
import CreateTeamFooter from './partials/CreateTeamFooter';

const CreateTeam = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    createTeam: { mutate, status },
  } = useTeam();

  const [disableButtons, setDisableButtons] = useState(false);

  const listMembers = useRecoilValue(membersListState);
  const [usersList, setUsersList] = useRecoilState(usersListState);

  const methods = useForm<{ text: string }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      text: '',
    },
    resolver: joiResolver(SchemaCreateTeam),
  });

  const resetListUsersState = useCallback(() => {
    const updateCheckedUser = usersList.map((user) => ({
      ...user,
      isChecked: user._id === session?.user.id,
    }));
    setUsersList(updateCheckedUser);
  }, [session?.user.id, setUsersList, usersList]);

  const saveTeam = (title: string) => {
    const membersListToSubmit: CreateTeamUser[] = listMembers.map((member) => ({
      ...member,
      user: member.user._id,
    }));

    mutate({ name: title, users: membersListToSubmit });
    resetListUsersState();
  };

  const handleBack = useCallback(() => {
    setDisableButtons(true);
    resetListUsersState();
    router.back();
  }, [resetListUsersState, router]);

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setIsOpen(true);
  };

  useEffect(() => {
    if (status === 'success') {
      router.push('/teams');
    }

    if (status === 'error') {
      setDisableButtons(false);
    }
  }, [status, router]);

  return (
    <Flex css={{ height: '100vh', backgroundColor: '$primary50' }} direction="column">
      <CreateTeamHeader
        title="Create New Team"
        disableBack={disableButtons}
        handleBack={handleBack}
      />
      <Flex css={{ height: '100%', position: 'relative', overflowY: 'auto' }} direction="column">
        <Flex css={{ flex: '1' }}>
          <StyledForm
            id="hook-form"
            direction="column"
            onSubmit={methods.handleSubmit(({ text }) => {
              saveTeam(text);
              setDisableButtons(true);
            })}
          >
            <FormProvider {...methods}>
              <TeamName />
              <Flex css={{ my: '$20' }} direction="column">
                <Flex>
                  <Text css={{ flex: 1 }} heading="3">
                    Team Members
                  </Text>
                  <Button variant="link" size="sm" onClick={handleOpen}>
                    <Icon name="plus" />
                    Add/remove members
                  </Button>
                </Flex>
              </Flex>
              <TeamMembersList teamUsers={listMembers} hasPermissions />
              <ListMembers isOpen={isOpen} setIsOpen={setIsOpen} />
            </FormProvider>
          </StyledForm>
          <TipBar />
        </Flex>
      </Flex>
      <CreateTeamFooter disableButton={disableButtons} handleBack={handleBack} />
    </Flex>
  );
};

export default CreateTeam;
