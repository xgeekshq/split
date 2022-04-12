import { SidebarContent } from "react-pro-sidebar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import DashboardIcon from "../icons/sidebar/Dashboard";
import BoardsIcon from "../icons/sidebar/Boards";
import UsersIcon from "../icons/sidebar/Users";
import TeamsIcon from "../icons/sidebar/Teams";
import LogoutIcon from "../icons/sidebar/Logout";
import AccountIcon from "../icons/sidebar/Account";
import SettingsIcon from "../icons/sidebar/Settings";
import { styled } from "../../stitches.config";
import Text from "../Primitives/Text";
import Flex from "../Primitives/Flex";
import {
  ACCOUNT_ROUTE,
  BOARDS_ROUTE,
  DASHBOARD_ROUTE,
  SETTINGS_ROUTE,
  START_PAGE_ROUTE,
  TEAMS_ROUTE,
  USERS_ROUTE,
} from "../../utils/routes";
import Separator from "./Separator";

const StyledMenuItem = styled(Flex, {
  pl: "$22",
  py: "$12",
  height: "$48",
  gap: "$14",
  alignItems: "center",
  "& svg": { color: "$primary300" },
  "&[data-active='true']": {
    "& svg": { color: "$white" },
    "& span": { color: "$white", fontWeight: "$medium" },
    backgroundColor: "$primary600",
  },
  "&:hover": {
    cursor: "pointer",
  },
});

const StyledText = styled(Text, {
  fontSize: "$14",
  color: "$primary300",
  lineHeight: "$20",
});

const StyledSeparator = styled(Separator, { marginTop: "$16", marginBottom: "$16" });

interface SidebarContentProps {
  strategy: string;
}

const SideBarContent: React.FC<SidebarContentProps> = ({ strategy }) => {
  const router = useRouter();
  const [active, setActive] = useState(router.asPath);
  const isStrategyLocal = strategy === "local";

  const handleSignOut = async () => {
    const result = await signOut({
      callbackUrl: isStrategyLocal ? START_PAGE_ROUTE : "/logoutAzure",
      redirect: !isStrategyLocal,
    });
    if (result && isStrategyLocal) {
      router.push(result.url);
    }
  };

  useEffect(() => {
    setActive(router.asPath);
  }, [router.asPath]);

  return (
    <SidebarContent>
      <Link href={DASHBOARD_ROUTE}>
        <StyledMenuItem data-active={active === DASHBOARD_ROUTE} align="center">
          <DashboardIcon />
          <StyledText>Dashboard</StyledText>
        </StyledMenuItem>
      </Link>
      <Link href={BOARDS_ROUTE}>
        <StyledMenuItem data-active={active === BOARDS_ROUTE} align="center">
          <BoardsIcon />
          <StyledText>Boards</StyledText>
        </StyledMenuItem>
      </Link>
      <Link href={USERS_ROUTE}>
        <StyledMenuItem data-active={active === USERS_ROUTE} align="center">
          <UsersIcon />
          <StyledText>Users</StyledText>
        </StyledMenuItem>
      </Link>
      <Link href={TEAMS_ROUTE}>
        <StyledMenuItem data-active={active === TEAMS_ROUTE} align="center">
          <TeamsIcon />
          <StyledText>Teams</StyledText>
        </StyledMenuItem>
      </Link>
      <StyledSeparator />
      <Link href={ACCOUNT_ROUTE}>
        <StyledMenuItem data-active={active === ACCOUNT_ROUTE} align="center">
          <AccountIcon />
          <StyledText>Account</StyledText>
        </StyledMenuItem>
      </Link>
      <Link href={SETTINGS_ROUTE}>
        <StyledMenuItem css={{ mb: "$16" }} data-active={active === SETTINGS_ROUTE} align="center">
          <SettingsIcon />
          <StyledText>Settings</StyledText>
        </StyledMenuItem>
      </Link>
      <StyledSeparator />
      <StyledMenuItem
        css={{ mt: "$16" }}
        data-active={active === TEAMS_ROUTE}
        align="center"
        onClick={handleSignOut}
      >
        <LogoutIcon />
        <StyledText>Log out</StyledText>
      </StyledMenuItem>
    </SidebarContent>
  );
};

export default SideBarContent;
