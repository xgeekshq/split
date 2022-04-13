import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { dehydrate, QueryClient, useQuery } from "react-query";
import React, { lazy, ReactElement, Suspense } from "react";
import { TailSpin } from "react-loader-spinner";
import { useSession } from "next-auth/react";
import { styled } from "../../stitches.config";
import Flex from "../../components/Primitives/Flex";
import Text from "../../components/Primitives/Text";
import { getDashboardBoardsRequest } from "../../api/boardService";
import requireAuthentication from "../../components/HOC/requireAuthentication";
import Layout from "../../components/Layout/Layout";
import QueryError from "../../components/Errors/QueryError";
import { getDashboardHeaderInfo } from "../../api/authService";

const RecentRetros = lazy(() => import("../../components/Dashboard/RecentRetros/RecentRetros"));
const Tiles = lazy(() => import("../../components/Dashboard/Tiles"));

const InnerContainer = styled(Flex, { mt: "$40", overflow: "scroll" });

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery("dashboardInfo", () => getDashboardHeaderInfo(context));
    await queryClient.prefetchInfiniteQuery("boards/dashboard", ({ pageParam = 0 }) =>
      getDashboardBoardsRequest(pageParam, context)
    );
    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  }
);

const Dashboard = () => {
  const { data: session } = useSession({ required: true });

  const { data } = useQuery("dashboardInfo", () => getDashboardHeaderInfo(), {
    enabled: true,
    refetchOnWindowFocus: false,
  });
  if (!session || !data) return null;
  return (
    <InnerContainer direction="column">
      <Suspense fallback={<TailSpin height={80} width={80} />}>
        <QueryError>
          <Tiles data={data} />
        </QueryError>
      </Suspense>
      <Suspense fallback={<TailSpin height={80} width={80} />}>
        <QueryError>
          <Text css={{ mt: "$64" }} heading="4">
            My recent retros
          </Text>
          <RecentRetros userId={session.user.id as string} />
        </QueryError>
      </Suspense>
    </InnerContainer>
  );
};
export default Dashboard;

Dashboard.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
