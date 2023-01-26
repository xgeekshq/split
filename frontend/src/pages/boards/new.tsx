import { useCallback, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Container, ContentContainer, PageHeader } from '@/styles/pages/boards/new.styles';
import Icon from '@/components/icons/Icon';
import Button from '@/components/Primitives/Button';
import Text from '@/components/Primitives/Text';
import Flex from '@/components/Primitives/Flex';
import { BoxColumnContainer } from '@/components/CreateBoard/SelectBoardType/BoxColumnContainer';
import useBoard from '@/hooks/useBoard';
import LoadingPage from '@/components/loadings/LoadingPage';
import { NEXT_PUBLIC_REGULAR_BOARD } from '@/utils/constants';

const NewBoard: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession({ required: true });

  const [isBackButtonDisable, setBackButtonState] = useState(false);

  const {
    createBoard: { status },
  } = useBoard({ autoFetchBoard: false });

  /**
   * Handle back to boards list page
   */
  const handleBack = useCallback(() => {
    setBackButtonState(true);
    router.back();
  }, [router]);

  if (!session) return null;

  return (
    <Container>
      <PageHeader>
        <Text color="primary800" heading={3} weight="bold">
          Add new board
        </Text>
        <Button isIcon size="lg" disabled={isBackButtonDisable} onClick={handleBack}>
          <Icon css={{ color: '$primaryBase' }} name="close" />
        </Button>
      </PageHeader>

      <ContentContainer>
        <Text heading={3} color="primary800" weight="bold">
          What kind of retro do you want to create?
        </Text>
        <Flex gap={40}>
          {NEXT_PUBLIC_REGULAR_BOARD && (
            <BoxColumnContainer
              iconName="blob-team-retro"
              title="Regular retro"
              description="Make a retro with one team and the usual setup as you are used to it."
              route="/boards/newRegularBoard"
            />
          )}

          <BoxColumnContainer
            iconName="blob-split-retro"
            title="SPLIT retro"
            description="Make a retro with a huge team or a whole company. Split into sub-teams with associated boards, and finally merge everything into one main board."
            route="/boards/newSplitBoard"
          />
        </Flex>
      </ContentContainer>
      {status === 'loading' && <LoadingPage />}
    </Container>
  );
};

export default NewBoard;
