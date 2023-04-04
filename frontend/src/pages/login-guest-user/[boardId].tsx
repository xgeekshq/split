import GuestUserForm from '@/components/auth/GuestUserForm';
import { ReactElement } from 'react';
import AccessLayout from '@/components/layouts/AccessLayout/AccessLayout';

const LoginGuestUser = () => <GuestUserForm />;

LoginGuestUser.getLayout = (page: ReactElement) => <AccessLayout>{page}</AccessLayout>;

export default LoginGuestUser;
