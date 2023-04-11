import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue } from 'recoil';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Input from '@/components/Primitives/Inputs/Input/Input';
import CreateFooter from '@/components/Primitives/Layout/CreateFooter/CreateFooter';
import CreateHeader from '@/components/Primitives/Layout/CreateHeader/CreateHeader';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import TipBar from '@/components/Primitives/Layout/TipBar/TipBar';
import Text from '@/components/Primitives/Text/Text';
import TeamMembersList from '@/components/Teams/Team/TeamMembersList';
import useCurrentSession from '@/hooks/useCurrentSession';
import SchemaCreateTeam from '@/schema/schemaCreateTeamForm';
import { createTeamState, usersListState } from '@/store/team/atom/team.atom';
import { StyledForm } from '@/styles/pages/pages.styles';
import { CreateTeamUser } from '@/types/team/team.user';
import { CREATE_TEAM_TIPS } from '@/utils/tips';
import { joiResolver } from '@hookform/resolvers/joi';

import useCreateTeam from '@/hooks/teams/useCreateTeam';
import { ROUTES } from '@/utils/routes';
import ListMembers from '@/components/Teams/Team/ListMembers/ListMembers';

const CreateTeam = () => {
  const { userId } = useCurrentSession();
  const { back, push } = useRouter();

  const { mutate: createTeam, status } = useCreateTeam();

  const [disableButtons, setDisableButtons] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const createTeamMembers = useRecoilValue(createTeamState);
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
      isChecked: user._id === userId,
    }));
    setUsersList(updateCheckedUser);
  }, [userId, setUsersList, usersList]);

  const saveTeam = (title: string) => {
    const membersListToSubmit: CreateTeamUser[] = createTeamMembers.map((member) => ({
      ...member,
      user: member.user._id,
    }));

    createTeam({ name: title, users: membersListToSubmit });
    resetListUsersState();
  };

  const handleBack = useCallback(() => {
    setDisableButtons(true);
    resetListUsersState();
    back();
  }, [resetListUsersState, back]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setIsOpen(true);
  };

  useEffect(() => {
    if (status === 'error') {
      setDisableButtons(false);
    }

    if (status === 'success') {
      push(ROUTES.Teams);
    }
  }, [status]);

  return (
    <Flex
      css={{ height: '100vh', backgroundColor: '$primary50' }}
      direction="column"
      data-testid="createTeam"
    >
      <CreateHeader title="Create New Team" disableBack={disableButtons} handleBack={handleBack} />
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
              <Text css={{ mb: '$12' }} heading="3">
                Team Name
              </Text>
              <Input showCount id="text" maxChars="40" placeholder="Team name" type="text" />
              <Flex css={{ my: '$20' }} direction="column">
                <Flex>
                  <Text css={{ flex: 1 }} heading="3">
                    Team Members
                  </Text>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleOpen}
                    data-testid="addRemoveMembersTrigger"
                  >
                    <Icon name="plus" />
                    Add/remove members
                  </Button>
                </Flex>
              </Flex>
              <TeamMembersList teamUsers={createTeamMembers} hasPermissions />
              <ListMembers isOpen={isOpen} setIsOpen={setIsOpen} />
            </FormProvider>
          </StyledForm>
          <TipBar tips={CREATE_TEAM_TIPS} />
        </Flex>
      </Flex>
      <CreateFooter
        disableButton={disableButtons}
        handleBack={handleBack}
        formId="hook-form"
        confirmationLabel="Create team"
      />
    </Flex>
  );
};

export default CreateTeam;
