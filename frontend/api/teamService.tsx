import { Team } from "../types/team/team";
import fetchData from "../utils/fetchData";

export const getAllTeams = (): Promise<Team[]> => {
  return fetchData(`/teams`);
};
