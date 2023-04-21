import { useCallback, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

import CreateHeader from '@/components/Primitives/Layout/CreateHeader/CreateHeader';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import Text from '@/components/Primitives/Text/Text';
import { NEXT_PUBLIC_REGULAR_BOARD } from '@/constants';
import { ROUTES } from '@/constants/routes';
import useBoard from '@/hooks/useBoard';
import useCurrentSession from '@/hooks/useCurrentSession';
import CreateBoardBox from '@components/Primitives/Layout/CreateBoardBox/CreateBoardBox';

const NewBoard: NextPage = () => {
  const {
    back,
    query: { team },
  } = useRouter();
  const { session } = useCurrentSession({ required: true });
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
        disableBack={isBackButtonDisable}
        handleBack={handleBack}
        title="Add new board"
      />
      <Flex align="center" css={{ height: '100%' }} direction="column" justify="center">
        <Text color="primary800" fontWeight="bold" heading={3}>
          What kind of retro do you want to create?
        </Text>
        <Flex gap={40}>
          {NEXT_PUBLIC_REGULAR_BOARD && (
            <Link href={{ pathname: ROUTES.NewRegularBoard, query: team ? { team } : undefined }}>
              <CreateBoardBox
                description="Make a retro with one team and the usual setup as you are used to it."
                iconName="blob-team-retro"
                title="Regular retro"
                type="column"
              />
            </Link>
          )}
          <Link href={{ pathname: ROUTES.NewSplitBoard, query: team ? { team } : undefined }}>
            <CreateBoardBox
              description="Make a retro with a huge team or a whole company. Split into sub-teams with associated boards, and finally merge everything into one main board."
              iconName="blob-split-retro"
              title="SPLIT retro"
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
