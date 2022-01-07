import React from "react";
import Link from "next/link";
import { getSession, GetSessionParams } from "next-auth/react";
import Flex from "../../components/Primitives/Flex";
import { RedirectServerSideProps, SessionServerSideProps } from "../../types/serverSideProps";
import { DASHBOARD_ROUTE } from "../../utils/routes";
import Auth from "../../components/auth";
import Grid from "../../components/Primitives/Grid";

export async function getServerSideProps(
  context: GetSessionParams | undefined
): Promise<RedirectServerSideProps | SessionServerSideProps> {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: DASHBOARD_ROUTE,
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

const AuthPage: React.FC = () => {
  return (
    <Flex justify="center" direction="column" align="center">
      <Link href="/">
        <h1>Divide and conquer</h1>
      </Link>
      <Grid columns={[1, 3]} justifyContent={["normal", "center"]}>
        <Auth />
        <img src={"https://via.placeholder.com/600"} width={600} height={600} />
      </Grid>
    </Flex>
  );
};

export default AuthPage;
