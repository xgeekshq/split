import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { joiResolver } from '@hookform/resolvers/joi';
import { useRecoilState, useSetRecoilState } from 'recoil';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Input from '@/components/Primitives/Inputs/Input/Input';
import CreateFooter from '@/components/Primitives/Layout/CreateFooter/CreateFooter';
import CreateHeader from '@/components/Primitives/Layout/CreateHeader/CreateHeader';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import TipBar from '@/components/Primitives/Layout/TipBar/TipBar';
import Text from '@/components/Primitives/Text/Text';
import TeamMembersList from '@/components/Teams/Team/TeamMembersList';
import { ROUTES } from '@/constants/routes';
import CREATE_TEAM_TIPS from '@/constants/tips/createTeam';
import { createSuccessMessage } from '@/constants/toasts';
import { TeamUserRoles } from '@/enums/teams/userRoles';
import useCreateTeam from '@/hooks/teams/useCreateTeam';
import useCurrentSession from '@/hooks/useCurrentSession';
import SchemaCreateTeam from '@/schema/schemaCreateTeamForm';
import { createTeamState } from '@/store/team.atom';
import { toastState } from '@/store/toast/atom/toast.atom';
import { usersListState } from '@/store/user.atom';
import { StyledForm } from '@/styles/pages/pages.styles';
import { CreateTeamUser } from '@/types/team/team.user';
import { UserList } from '@/types/team/userList';
import UserListDialog from '@components/Primitives/Dialogs/UserListDialog/UserListDialog';
import { verifyIfIsNewJoiner } from '@utils/verifyIfIsNewJoiner';

const CreateTeam = () => {
  const { userId } = useCurrentSession();
  const { back, push } = useRouter();
  const setToastState = useSetRecoilState(toastState);

  const { mutate: createTeam } = useCreateTeam();

  const [disableButtons, setDisableButtons] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [createTeamMembers, setCreateTeamMembers] = useRecoilState(createTeamState);
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

    createTeam(
      { name: title, users: membersListToSubmit },
      {
        onSuccess: () => {
          push(ROUTES.Teams);
        },
        onError: () => {
          setDisableButtons(false);
        },
      },
    );
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

  const saveMembers = (checkedUserList: UserList[]) => {
    const selectedUsers = checkedUserList.filter((user) => user.isChecked);

    const updatedListWithAdded = selectedUsers.map((user) => {
      const isNewJoiner = verifyIfIsNewJoiner(user.joinedAt, user.providerAccountCreatedAt);

      return (
        createTeamMembers.find((member) => member.user._id === user._id) || {
          user,
          role: TeamUserRoles.MEMBER,
          isNewJoiner,
          canBeResponsible: !isNewJoiner,
        }
      );
    });

    // Sort by Name
    updatedListWithAdded.sort((a, b) => {
      const aFullName = `${a.user.firstName.toLowerCase()} ${a.user.lastName.toLowerCase()}`;
      const bFullName = `${b.user.firstName.toLowerCase()} ${b.user.lastName.toLowerCase()}`;

      return aFullName < bFullName ? -1 : 1;
    });

    // this insures that the team creator stays always in first
    const userAdminIndex = updatedListWithAdded.findIndex((member) => member.user._id === userId);

    updatedListWithAdded.unshift(updatedListWithAdded.splice(userAdminIndex, 1)[0]);

    setToastState(createSuccessMessage('Team member/s successfully updated'));

    setCreateTeamMembers(updatedListWithAdded);
    setUsersList(checkedUserList);

    setIsOpen(false);
  };

  return (
    <Flex
      css={{ height: '100vh', backgroundColor: '$primary50' }}
      data-testid="createTeam"
      direction="column"
    >
      <CreateHeader disableBack={disableButtons} handleBack={handleBack} title="Create New Team" />
      <Flex css={{ height: '100%', position: 'relative', overflowY: 'auto' }} direction="column">
        <Flex css={{ flex: '1' }}>
          <StyledForm
            direction="column"
            id="hook-form"
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
                    data-testid="addRemoveMembersTrigger"
                    onClick={handleOpen}
                    size="sm"
                    variant="link"
                  >
                    <Icon name="plus" />
                    Add/remove members
                  </Button>
                </Flex>
              </Flex>
              <TeamMembersList hasPermissions teamUsers={createTeamMembers} />
              <UserListDialog
                confirmationHandler={saveMembers}
                confirmationLabel="Add/remove members"
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Team Members"
                usersList={usersList}
              />
            </FormProvider>
          </StyledForm>
          <TipBar tips={CREATE_TEAM_TIPS} />
        </Flex>
      </Flex>
      <CreateFooter
        confirmationLabel="Create team"
        disableButton={disableButtons}
        formId="hook-form"
        handleBack={handleBack}
      />
    </Flex>
  );
};

export default CreateTeam;
