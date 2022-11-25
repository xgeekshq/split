import { Session } from 'next-auth';

export interface RedirectServerSideProps {
  redirect: {
    destination: string;
    permanent: boolean;
  };
  props?: undefined;
}

export interface SessionServerSideProps {
  props: {
    session?: Session | null;
  };
  redirect?: undefined;
}
