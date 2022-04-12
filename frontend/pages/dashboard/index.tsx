import React, { ReactElement } from "react";
import { GetServerSideProps } from "next";
import { styled } from "../../stitches.config";
import Flex from "../../components/Primitives/Flex";
import requireAuthentication from "../../components/HOC/requireAuthentication";
import Layout from "../../components/Layout/Layout";

export const getServerSideProps: GetServerSideProps = requireAuthentication(async () => {
  return {
    props: {},
  };
});

const InnerContainer = styled(Flex, { mt: "$40", overflow: "scroll" });

const Dashboard = () => {
  return <InnerContainer direction="column">Dashboard</InnerContainer>;
};
export default Dashboard;

Dashboard.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
