import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { joiResolver } from '@hookform/resolvers/joi';
import Input from '@/components/Primitives/Input';
import Text from '@/components/Primitives/Text';
import { LoginGuestUser } from '@/types/user/user';
import { START_PAGE_ROUTE } from '@/utils/routes';
import Button from '@/components/Primitives/Button';
import Flex from '@/components/Primitives/Flex';
import SchemaLoginGuestForm from '@/schema/schemaLoginGuestForm';
import { OrSeparator, StyledForm } from '../LoginForm/styles';

const GuestUserForm = () => {
  const router = useRouter();

  //   const [loading, setLoading] = useState({ credentials: false, sso: false });
  //   const setToastState = useSetRecoilState(toastState);

  const methods = useForm<LoginGuestUser>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      username: '',
    },
    resolver: joiResolver(SchemaLoginGuestForm),
  });

  //   const handleLogin = async (credentials: LoginGuestUser) => {
  //     setLoading((prevState) => ({ ...prevState, credentials: true }));
  //     const result = await signIn<RedirectableProviderType>('credentials', {
  //       ...credentials,
  //       callbackUrl: DASHBOARD_ROUTE,
  //       redirect: false,
  //     });
  //     if (!result?.error) {
  //       setToastState((prev) => ({ ...prev, open: false }));
  //       router.push(DASHBOARD_ROUTE);
  //       return;
  //     }

  //     if (result.error) {
  //       methods.reset();
  //       setToastState({
  //         open: true,
  //         type: ToastStateEnum.ERROR,
  //         content: result.error,
  //       });
  //     }

  //     setLoading((prevState) => ({ ...prevState, credentials: false }));
  //   };

  const handleClick = () => {
    router.push(START_PAGE_ROUTE);
  };

  // TODO check submit btn from loggin page

  return (
    <FormProvider {...methods}>
      <StyledForm autoComplete="off" direction="column" style={{ width: '100%' }}>
        <Text css={{ mt: '$24' }} heading="1">
          Guest User
        </Text>
        <Text size="md" color="primary500" css={{ mt: '$8' }}>
          Enter a guest user name and join the retro.
        </Text>
        <Input css={{ mt: '$32' }} id="username" placeholder="Guest user name" type="text" />

        <Button size="lg" type="submit">
          Log in as guest
        </Button>
        <Flex align="center" direction="column" justify="center">
          <OrSeparator>
            <hr />
            <Text color="primary300" size="sm" fontWeight="medium">
              or
            </Text>
            <hr />
          </OrSeparator>
          <Button css={{ width: '100%' }} size="lg" onClick={handleClick}>
            Sign In
          </Button>
        </Flex>
      </StyledForm>
    </FormProvider>
  );
};

export default GuestUserForm;
