import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getSession, GetSessionParams } from "next-auth/react";
import Flex from "../../components/Primitives/Flex";
import { RedirectServerSideProps, SessionServerSideProps } from "../../types/serverSideProps";
import { DASHBOARD_PATH } from "../../utils/constants";
import Auth from "../../components/auth";
import Grid from "../../components/Primitives/Grid";
import profilePic from "../../public/1200.png";

export async function getServerSideProps(
  context: GetSessionParams | undefined
): Promise<RedirectServerSideProps | SessionServerSideProps> {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: DASHBOARD_PATH,
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
      <Grid columns={[1, 2]}>
        <Auth />
        <Image src={profilePic} alt="Picture of the author" width={500} height={500} />
      </Grid>
    </Flex>
  );
};

export default AuthPage;
