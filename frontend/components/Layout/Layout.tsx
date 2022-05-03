import React, { useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { TailSpin } from "react-loader-spinner";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import Flex from "../Primitives/Flex";
import { REFRESH_TOKEN_ERROR } from "../../utils/constants";
import SideBar from "../Sidebar/Sidebar";
import SpinnerPage from "../Loading/SpinnerPage";
import { BOARDS_ROUTE, DASHBOARD_ROUTE } from "../../utils/routes";
import DashboardLayout from "./DashboardLayout";
import { createBoardState } from "../../store/createBoard/atoms/create-board.atom";
import CreateBoard from "../CreateBoard/CreateBoard";

const Layout: React.FC = ({ children }) => {
  const { data: session } = useSession({ required: true });
  const [showCreateBoard] = useRecoilState(createBoardState);

  const router = useRouter();

  const isDashboard = router.pathname === DASHBOARD_ROUTE;
  const isBoards = router.pathname === BOARDS_ROUTE;

  if (session?.error === REFRESH_TOKEN_ERROR) {
    signOut({ callbackUrl: "/" });
  }

  const renderMain = useMemo(() => {
    if (!session) return null;
    return (
      <DashboardLayout
        firstName={session.user.firstName}
        isDashboard={isDashboard}
        isBoards={isBoards}
      >
        {children}
      </DashboardLayout>
    );
  }, [children, isBoards, isDashboard, session]);

  if (!session) return <SpinnerPage />;
  if (showCreateBoard)
    return (
      <Flex css={{ height: "100vh", width: "100vw" }}>
        <CreateBoard />
      </Flex>
    );
  return (
    <Flex css={{ height: "100vh", width: "100vw" }}>
      <SideBar
        firstName={session.user.firstName}
        lastName={session.user.lastName}
        email={session.user.email}
        strategy={session.strategy}
      />
      {renderMain}
      {!session && (
        <Flex css={{ height: "100vh", width: "100vw" }}>
          <Flex css={{ position: "absolute", top: "40%", left: "55%" }}>
            <TailSpin color="#060D16" height={150} width={150} />
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default Layout;
