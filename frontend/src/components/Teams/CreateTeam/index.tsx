import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';
import { membersListState } from '@/store/team/atom/team.atom';
import { Container, ContentContainer, PageHeader } from '@/styles/pages/boards/new.styles';
import { CreateTeamUser } from '@/types/team/team.user';
import useTeam from '@/hooks/useTeam';
import SchemaCreateTeam from '@/schema/schemaCreateTeamForm';
import Button from '@/components/Primitives/Button';
import Text from '@/components/Primitives/Text';
import Icon from '@/components/icons/Icon';
import {
  ButtonsContainer,
  InnerContent,
  StyledForm,
  SubContainer,
} from '@/styles/pages/boards/newSplitBoard.styles';
import TipBar from './TipBar';
import TeamName from './TeamName';
import TeamMembersList from './ListCardsMembers';

const CreateTeam = () => {
  const router = useRouter();

  const {
    createTeam: { mutate, status },
  } = useTeam({ autoFetchTeam: false });

  const [isBackButtonDisable, setBackButtonState] = useState(false);

  const listMembers = useRecoilValue(membersListState);

  const methods = useForm<{ text: string }>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      text: '',
    },
    resolver: joiResolver(SchemaCreateTeam),
  });

  const teamName = useWatch({
    control: methods.control,
    name: 'text',
  });

  const saveTeam = (title: string) => {
    const membersListToSubmit: CreateTeamUser[] = listMembers.map((member) => ({
      ...member,
      user: member.user._id,
    }));

    mutate({ name: title, users: membersListToSubmit });
  };

  const handleBack = useCallback(() => {
    setBackButtonState(true);
    router.back();
  }, [router]);

  useEffect(() => {
    if (status === 'success') {
      router.push('/teams');
    }
  }, [status, router]);

  return (
    <Container>
      <PageHeader>
        <Text color="primary800" heading={3} weight="bold">
          Create New Team
        </Text>
        <Button isIcon disabled={isBackButtonDisable} onClick={handleBack}>
          <Icon name="close" />
        </Button>
      </PageHeader>
      <ContentContainer>
        <SubContainer>
          <StyledForm
            direction="column"
            onSubmit={methods.handleSubmit(({ text }) => {
              saveTeam(text);
            })}
          >
            <InnerContent direction="column">
              <FormProvider {...methods}>
                <TeamName teamName={teamName} />
                <TeamMembersList />
              </FormProvider>
            </InnerContent>
            <ButtonsContainer gap="24" justify="end">
              <Button
                disabled={isBackButtonDisable}
                type="button"
                variant="lightOutline"
                onClick={handleBack}
              >
                Cancel
              </Button>
              <Button type="submit">Create team</Button>
            </ButtonsContainer>
          </StyledForm>
        </SubContainer>
        <TipBar />
      </ContentContainer>
    </Container>
  );
};

export default CreateTeam;
