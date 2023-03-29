import React, { useEffect, useMemo, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import EmptyBoards from '@/components/Dashboard/RecentRetros/partials/EmptyBoards';
import BoardType from '@/types/board/board';
import { Team } from '@/types/team/team';
import isEmpty from '@/utils/isEmpty';
import { useRouter } from 'next/router';
import { teamsListState } from '@/store/team/atom/team.atom';
import { filterTeamBoardsState } from '@/store/board/atoms/board.atom';
import useBoard from '@/hooks/useBoard';
import FilterBoards from '../Filters/FilterBoards';
import ListBoardsByTeam from './ListBoardsByTeam';
import ListBoards from './ListBoards';
import ListPersonalBoards from './ListPersonalBoards';

interface MyBoardsProps {
  userId: string;
  isSuperAdmin: boolean;
}

export interface OptionType {
  value: string;
  label: string;
}

const MyBoards = ({ userId, isSuperAdmin }: MyBoardsProps) => {
  const [filterState, setFilterState] = useRecoilState(filterTeamBoardsState);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const routerTeam = router.query.team as string;
  const userTeamsList = useRecoilValue(teamsListState);

  const { fetchBoards } = useBoard({ autoFetchBoards: true });

  const { data, isLoading } = fetchBoards;

  useEffect(() => {
    if (routerTeam) setFilterState(routerTeam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dataByTeamAndDate = useMemo(() => {
    const teams = new Map<string, Team>();
    const boardsTeamAndDate = new Map<string, Map<string, BoardType[]>>();

    data?.pages.forEach((page) => {
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
  }, [data?.pages]);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight + 2 >= scrollHeight && fetchBoards.hasNextPage) {
        fetchBoards.fetchNextPage();
      }
    }
  };

  const teamNames: OptionType[] = userTeamsList.map((team) => ({
    value: team.id,
    label: team.name,
  }));

  if (filterState === 'all' && isEmpty(dataByTeamAndDate.boardsTeamAndDate.size) && !isLoading)
    return <EmptyBoards />;

  const filteredTeam: Team | undefined = userTeamsList.find((team) => team.id === filterState);

  return (
    <>
      <FilterBoards teamNames={teamNames} />

      {!['all', 'personal'].includes(filterState) && filteredTeam && (
        <ListBoardsByTeam filteredTeam={filteredTeam} userId={userId} isSuperAdmin={isSuperAdmin} />
      )}
      {filterState === 'personal' && (
        <ListPersonalBoards userId={userId} isSuperAdmin={isSuperAdmin} />
      )}
      {filterState === 'all' && (
        <ListBoards
          userId={userId}
          isSuperAdmin={isSuperAdmin}
          dataByTeamAndDate={dataByTeamAndDate}
          scrollRef={scrollRef}
          onScroll={onScroll}
          filter={filterState}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default MyBoards;
