import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { joiResolver } from '@hookform/resolvers/joi';
import Input from '@/components/Primitives/Inputs/Input/Input';
import Text from '@/components/Primitives/Text/Text';
import { LoginGuestUser } from '@/types/user/user';
import { START_PAGE_ROUTE } from '@/utils/routes';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import SchemaLoginGuestForm from '@/schema/schemaLoginGuestForm';
import { getUsername } from '@/utils/getUsername';
import useRegisterGuestUser from '@/hooks/auth/useRegisterGuestUser';
import { ReactElement } from 'react';
import { StyledForm } from '@/components/auth/LoginForm/styles';
import AccessLayout from '@/components/layouts/AccessLayout/AccessLayout';
import { CreateGuestUser } from '@/types/user/create-login.user';
import Separator from '@/components/Primitives/Separator/Separator';

const LoginGuestUserPage = () => {
  const router = useRouter();
  const board = (router.query.boardId || '') as string;

  const { mutate } = useRegisterGuestUser();

  const methods = useForm<LoginGuestUser>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      username: '',
    },
    resolver: joiResolver(SchemaLoginGuestForm),
  });

  const handleLogin = (guestUser: CreateGuestUser) => {
    mutate(guestUser, {
      onSuccess: () => {
        router.push({ pathname: `/boards/[boardId]`, query: { boardId: board } });
      },
    });
  };

  const handleClick = () => {
    router.push(START_PAGE_ROUTE);
  };

  return (
    <FormProvider {...methods}>
      <StyledForm
        autoComplete="off"
        direction="column"
        style={{ width: '100%' }}
        onSubmit={methods.handleSubmit(({ username }) => {
          const user = getUsername(username);
          handleLogin({ board, firstName: user.firstName, lastName: user.lastName });
        })}
      >
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
          <Flex align="center" css={{ width: '100%', my: '$26' }} gap="16">
            <Separator />
            <Text color="primary300" size="sm" fontWeight="medium">
              OR
            </Text>
            <Separator />
          </Flex>
          <Button css={{ width: '100%' }} size="lg" onClick={handleClick}>
            Sign In
          </Button>
        </Flex>
      </StyledForm>
    </FormProvider>
  );
};

LoginGuestUserPage.getLayout = (page: ReactElement) => <AccessLayout>{page}</AccessLayout>;

export default LoginGuestUserPage;
