import React, { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';

import FilterBoards from '@/components/Boards/Filters/FilterBoards';
import ListBoards from '@/components/Boards/MyBoards/ListBoards';
import ListBoardsByTeam from '@/components/Boards/MyBoards/ListBoardsByTeam';
import ListPersonalBoards from '@/components/Boards/MyBoards/ListPersonalBoards';
import EmptyBoards from '@/components/Dashboard/RecentRetros/partials/EmptyBoards';
import useTeams from '@/hooks/teams/useTeams';
import useBoard from '@/hooks/useBoard';
import useCurrentSession from '@/hooks/useCurrentSession';
import { filterTeamBoardsState } from '@/store/board/atoms/board.atom';
import BoardType from '@/types/board/board';
import { Team } from '@/types/team/team';
import isEmpty from '@/utils/isEmpty';

interface MyBoardsProps {
  userId: string;
  isSuperAdmin: boolean;
}

export interface OptionType {
  value: string;
  label: string;
}

const MyBoards = ({ userId, isSuperAdmin }: MyBoardsProps) => {
  const router = useRouter();
  const { isSAdmin } = useCurrentSession();
  const scrollRef = useRef<HTMLDivElement>(null);
  const routerTeam = router.query.team as string;

  const [filterState, setFilterState] = useRecoilState(filterTeamBoardsState);

  const {
    fetchAllTeams: { data: userTeamsList, isError: isTeamsError },
    handleErrorOnFetchAllTeams,
  } = useTeams(isSAdmin);

  const { fetchBoards, handleFetchBoardsOnError } = useBoard({ autoFetchBoards: true });
  const { data: paginatedBoards, isLoading, isError: isBoardsError } = fetchBoards;

  useEffect(() => {
    if (routerTeam) setFilterState(routerTeam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isBoardsError) {
    handleFetchBoardsOnError();
  }

  if (isTeamsError) {
    handleErrorOnFetchAllTeams();
  }

  const dataByTeamAndDate = useMemo(() => {
    const teams = new Map<string, Team>();
    const boardsTeamAndDate = new Map<string, Map<string, BoardType[]>>();

    paginatedBoards?.pages.forEach((page) => {
      page.boards?.forEach((board) => {
        const boardsOfTeam = boardsTeamAndDate.get(`${board.team?.id ?? `personal`}`);
        const date = new Date(board.updatedAt).toDateString();
        if (!boardsOfTeam) {
          boardsTeamAndDate.set(`${board.team?.id ?? `personal`}`, new Map([[date, [board]]]));
          if (board.team) teams.set(`${board.team?.id}`, board.team);
          return;
        }
        const boardsOfDay = boardsOfTeam.get(date);
        if (boardsOfDay) {
          boardsOfDay.push(board);
          return;
        }
        boardsOfTeam.set(date, [board]);
      });
    });
    return { boardsTeamAndDate, teams };
  }, [paginatedBoards?.pages]);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight + 2 >= scrollHeight && fetchBoards.hasNextPage) {
        fetchBoards.fetchNextPage();
      }
    }
  };

  if (filterState === 'all' && isEmpty(dataByTeamAndDate.boardsTeamAndDate.size) && !isLoading)
    return <EmptyBoards />;

  const teamNames: OptionType[] = (userTeamsList ?? []).map((team) => ({
    value: team.id,
    label: team.name,
  }));

  const filteredTeam: Team | undefined = (userTeamsList ?? []).find(
    (team) => team.id === filterState,
  );

  return (
    <>
      <FilterBoards teamNames={teamNames} />

      {!['all', 'personal'].includes(filterState) && filteredTeam && (
        <ListBoardsByTeam filteredTeam={filteredTeam} isSuperAdmin={isSuperAdmin} userId={userId} />
      )}
      {filterState === 'personal' && (
        <ListPersonalBoards isSuperAdmin={isSuperAdmin} userId={userId} />
      )}
      {filterState === 'all' && (
        <ListBoards
          dataByTeamAndDate={dataByTeamAndDate}
          filter={filterState}
          isLoading={isLoading}
          isSuperAdmin={isSuperAdmin}
          onScroll={onScroll}
          scrollRef={scrollRef}
          userId={userId}
        />
      )}
    </>
  );
};

export default MyBoards;
