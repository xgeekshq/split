import { useSession } from 'next-auth/react';

const useCurrentSession = () => {
  const { data: session, status } = useSession();

  if (!session?.user) {
    return {
      ...session,
      status,
    };
  }

  const { id: userId, isSAdmin } = session.user;

  return {
    userId,
    isSAdmin,
    status,
  };
};

export default useCurrentSession;
