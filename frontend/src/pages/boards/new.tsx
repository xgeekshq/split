import { useCallback, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ContentContainer } from '@/styles/pages/boards/new.styles';
import Text from '@/components/Primitives/Text/Text';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { BoxColumnContainer } from '@/components/CreateBoard/SelectBoardType/BoxColumnContainer';
import useBoard from '@/hooks/useBoard';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import { NEXT_PUBLIC_REGULAR_BOARD } from '@/utils/constants';
import CreateHeader from '@/components/Primitives/Layout/CreateHeader/CreateHeader';

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
    <Flex css={{ height: '100vh', backgroundColor: '$primary50' }} direction="column">
      <CreateHeader
        title="Add new board"
        disableBack={isBackButtonDisable}
        handleBack={handleBack}
      />
      <ContentContainer>
        <Text heading={3} color="primary800" fontWeight="bold">
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
    </Flex>
  );
};

export default NewBoard;
