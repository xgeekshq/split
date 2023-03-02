import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';
import { membersListState, usersListState } from '@/store/team/atom/team.atom';
import { CreateTeamUser } from '@/types/team/team.user';
import useTeam from '@/hooks/useTeam';
import SchemaCreateTeam from '@/schema/schemaCreateTeamForm';
import Button from '@/components/Primitives/Button';
import Text from '@/components/Primitives/Text';
import Icon from '@/components/Primitives/Icon';
import {
  PageHeader,
  ContentContainer,
  SubContainer,
  InnerContent,
  StyledForm,
  ButtonsContainer,
} from '@/styles/pages/boards/newSplitBoard.styles';
import { useSession } from 'next-auth/react';
import TeamMembersList from '@/components/Teams/Team';
import Flex from '@/components/Primitives/Flex';
import TipBar from './partials/TipBar';
import TeamName from './TeamName';
import { ListMembers } from './ListMembers';

const CreateTeam = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    createTeam: { mutate, status },
  } = useTeam();

  const [isBackButtonDisable, setBackButtonState] = useState(false);
  const [isSubmitButtonDisable, setSubmitButtonState] = useState(false);

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
    setBackButtonState(true);
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
      setSubmitButtonState(false);
    }
  }, [status, router]);

  return (
    <Flex css={{ height: '100vh', backgroundColor: '$primary50' }} direction="column">
      <PageHeader>
        <Text color="primary800" heading={3} fontWeight="bold">
          Create New Team
        </Text>
        <Button isIcon size="lg" disabled={isBackButtonDisable} onClick={handleBack}>
          <Icon css={{ color: '$primaryBase' }} name="close" />
        </Button>
      </PageHeader>
      <Flex css={{ height: '100%', position: 'relative', overflowY: 'auto' }} direction="column">
        <ContentContainer>
          <SubContainer>
            <StyledForm
              id="hook-form"
              direction="column"
              onSubmit={methods.handleSubmit(({ text }) => {
                saveTeam(text);
                setSubmitButtonState(true);
              })}
            >
              <InnerContent direction="column">
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
                  <ListMembers isOpen={isOpen} setIsOpen={setIsOpen} />
                  <TeamMembersList users={listMembers} hasPermissions />
                </FormProvider>
              </InnerContent>
            </StyledForm>
          </SubContainer>
          <TipBar />
        </ContentContainer>
      </Flex>
      <ButtonsContainer gap="24" justify="end">
        <Button
          disabled={isBackButtonDisable}
          type="button"
          variant="lightOutline"
          onClick={handleBack}
        >
          Cancel
        </Button>
        <Button form="hook-form" disabled={isSubmitButtonDisable} type="submit">
          Create team
        </Button>
      </ButtonsContainer>
    </Flex>
  );
};

export default CreateTeam;
