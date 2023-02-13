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
import Icon from '@/components/icons/Icon';
import {
  Container,
  PageHeader,
  ContentWrapper,
  ContentContainer,
  SubContainer,
  InnerContent,
  StyledForm,
  ButtonsContainer,
} from '@/styles/pages/boards/newSplitBoard.styles';
import { useSession } from 'next-auth/react';
import TipBar from './TipBar';
import TeamName from './TeamName';
import TeamMembersList from './ListCardsMembers';

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

  useEffect(() => {
    if (status === 'success') {
      router.push('/teams');
    }

    if (status === 'error') {
      setSubmitButtonState(false);
    }
  }, [status, router]);

  return (
    <Container>
      <PageHeader>
        <Text color="primary800" heading={3} fontWeight="bold">
          Create New Team
        </Text>
        <Button isIcon size="lg" disabled={isBackButtonDisable} onClick={handleBack}>
          <Icon css={{ color: '$primaryBase' }} name="close" />
        </Button>
      </PageHeader>
      <ContentWrapper>
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
                  <TeamMembersList />
                </FormProvider>
              </InnerContent>
            </StyledForm>
          </SubContainer>
          <TipBar />
        </ContentContainer>
      </ContentWrapper>
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
    </Container>
  );
};

export default CreateTeam;
