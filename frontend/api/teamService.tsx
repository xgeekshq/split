import { GetServerSidePropsContext } from "next";
import { Team } from "../types/team/team";
import fetchData from "../utils/fetchData";

export const getAllTeams = (context?: GetServerSidePropsContext): Promise<Team[]> => {
  return fetchData(`/teams`, { context, serverSide: !!context });
};
