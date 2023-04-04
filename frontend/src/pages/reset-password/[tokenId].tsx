import { ReactElement } from 'react';

import { useRouter } from 'next/router';

import ResetPassword from '@/components/auth/ForgotPassword/ResetPassword';
import AccessLayout from '@/components/layouts/AccessLayout/AccessLayout';

const ResetPasswordPage = () => {
  const router = useRouter();
  const tokenId = (router.query.tokenId || '') as string;

  return tokenId && <ResetPassword token={tokenId} />;
};

ResetPasswordPage.getLayout = (page: ReactElement) => <AccessLayout>{page}</AccessLayout>;

export default ResetPasswordPage;
