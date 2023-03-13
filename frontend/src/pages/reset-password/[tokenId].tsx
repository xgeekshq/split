import { useRouter } from 'next/router';

import { styled } from '@/styles/stitches/stitches.config';

import ResetPassword from '@/components/auth/ForgotPassword/ResetPassword';
import Banner from '@/components/icons/Banner';
import Flex from '@/components/Primitives/Layout/Flex';

const CenteredContainer = styled(Flex, {
  position: 'absolute',
  top: '$202',
  right: '$162',
  boxSizing: 'border-box',
  '@media (max-height: 1023px)': {
    top: 'calc((100vh - 710px) / 2)',
  },
  '&:focus': { outline: 'none' },
});

const MainContainer = styled(Flex, {
  height: '100vh',
  width: '100%',
  position: 'relative',
  backgroundColor: '$black',
  backgroundImage: 'url(/images/background.svg)',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
});

const BannerContainer = styled(Flex, {
  mt: '$74',
  ml: '$62',
  size: 'fit-content',
});

const TokenId = () => {
  const router = useRouter();
  const { tokenId } = router.query || { tokenId: '' };
  const stringedToken = String(tokenId);

  return (
    <MainContainer>
      <BannerContainer>
        <Banner />
      </BannerContainer>
      <CenteredContainer>{tokenId && <ResetPassword token={stringedToken} />}</CenteredContainer>
    </MainContainer>
  );
};
export default TokenId;
