import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSession } from "next-auth/react";
import { AUTH_ROUTE } from "../../utils/routes";

function requireAuthentication(gssp: GetServerSideProps) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<
    GetServerSidePropsResult<{
      [key: string]: any;
    }>
  > => {
    const session = await getSession(ctx);

    if (!session) {
      return {
        redirect: {
          destination: AUTH_ROUTE,
          permanent: true,
        },
      };
    }

    return gssp(ctx);
  };
}

export default requireAuthentication;
