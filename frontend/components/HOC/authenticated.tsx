import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSession } from "next-auth/react";
import { DASHBOARD_ROUTE } from "../../utils/routes";

function authenticated(gssp: GetServerSideProps) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<
    GetServerSidePropsResult<{
      [key: string]: any;
    }>
  > => {
    const session = await getSession(ctx);

    if (session) {
      return {
        redirect: {
          destination: DASHBOARD_ROUTE,
          permanent: false,
        },
      };
    }

    return gssp(ctx);
  };
}

export default authenticated;
