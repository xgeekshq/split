import { useSession } from 'next-auth/react';

type UserCurrentSessionProps = {
  required: boolean;
};

const useCurrentSession = ({ required = false }: Partial<UserCurrentSessionProps> = {}) => {
  const { data: session, status } = useSession({ required });

  if (!session?.user) {
    return {
      ...session,
      status,
    };
  }

  const { id: userId, isSAdmin } = session.user;

  return {
    session,
    userId,
    isSAdmin,
    status,
  };
};

export default useCurrentSession;
