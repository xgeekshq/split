import { useSession } from 'next-auth/react';

type UserCurrentSessionProps = {
  required: boolean;
};

const useCurrentSession = ({ required = false }: Partial<UserCurrentSessionProps> = {}) => {
  const { data: session, status } = useSession({ required });

  const userId = session?.user.id ?? '';
  const isSAdmin = session?.user.isSAdmin ?? false;

  return {
    session,
    userId,
    isSAdmin,
    status,
  };
};

export default useCurrentSession;
