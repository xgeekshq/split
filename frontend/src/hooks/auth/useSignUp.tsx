import { useQuery } from '@tanstack/react-query';

import { NEXT_PUBLIC_ENABLE_AZURE } from '@/constants';
import { checkUserExists, checkUserExistsAD } from '@api/authService';

type EmailNameType = {
  email: string;
  goback: boolean;
};

const useSignUp = (emailName: EmailNameType) => {
  return useQuery({
    queryKey: ['checkUserExists', emailName.email],
    queryFn: () =>
      NEXT_PUBLIC_ENABLE_AZURE
        ? checkUserExistsAD(emailName.email)
        : checkUserExists(emailName.email),
    enabled: !!emailName.email && !emailName.goback,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export default useSignUp;
