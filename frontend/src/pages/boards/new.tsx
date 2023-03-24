import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import CreateBoardBox from '@/components/CreateBoard/CreateBoardBox/CreateBoardBox';
import CreateHeader from '@/components/Primitives/Layout/CreateHeader/CreateHeader';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import Text from '@/components/Primitives/Text/Text';
import useBoard from '@/hooks/useBoard';
import { NEXT_PUBLIC_REGULAR_BOARD } from '@/utils/constants';
import { ROUTES } from '@/utils/routes';

const NewBoard: NextPage = () => {
  const {
    back,
    query: { team },
  } = useRouter();
  const { data: session } = useSession({ required: true });
  const [isBackButtonDisable, setBackButtonState] = useState(false);

  const {
    createBoard: { status },
  } = useBoard({ autoFetchBoard: false });

  // Handle back to boards list page
  const handleBack = useCallback(() => {
    setBackButtonState(true);
    back();
  }, [back]);

  if (!session) return null;

  return (
    <Flex css={{ height: '100vh', backgroundColor: '$primary50' }} direction="column">
      <CreateHeader
        title="Add new board"
        disableBack={isBackButtonDisable}
        handleBack={handleBack}
      />
      <Flex direction="column" align="center" justify="center" css={{ height: '100%' }}>
        <Text heading={3} color="primary800" fontWeight="bold">
          What kind of retro do you want to create?
        </Text>
        <Flex gap={40}>
          {NEXT_PUBLIC_REGULAR_BOARD && (
            <Link href={{ pathname: ROUTES.NewRegularBoard, query: team ? { team } : undefined }}>
              <CreateBoardBox
                iconName="blob-team-retro"
                title="Regular retro"
                description="Make a retro with one team and the usual setup as you are used to it."
                type="column"
              />
            </Link>
          )}
          <Link href={{ pathname: ROUTES.NewSplitBoard, query: team ? { team } : undefined }}>
            <CreateBoardBox
              iconName="blob-split-retro"
              title="SPLIT retro"
              description="Make a retro with a huge team or a whole company. Split into sub-teams with associated boards, and finally merge everything into one main board."
              type="column"
            />
          </Link>
        </Flex>
      </Flex>
      {status === 'loading' && <LoadingPage />}
    </Flex>
  );
};

export default NewBoard;
