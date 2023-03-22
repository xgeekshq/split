import React, { useEffect, useMemo, useRef, useState } from 'react';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Dots from '@/components/Primitives/Loading/Dots/Dots';
import useUser from '@/hooks/useUser';
import { UserWithTeams } from '@/types/user/user';

import UserItem from './UserItem/UserItem';
import UsersSubHeader from './UsersSubHeader/UsersSubHeader';

const UsersList = () => {
  const [search, setSearch] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    fetchUsersWithTeams: { data, isFetching, hasNextPage, fetchNextPage, refetch },
  } = useUser({ options: { search }, autoFetchUsersWithTeams: true });
  const userAmount = data?.pages[0].userAmount;

  const users = useMemo(() => {
    const usersArray: UserWithTeams[] = data?.pages.flatMap((page) => page.userWithTeams) ?? [];
    return usersArray;
  }, [data?.pages]);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight + 2 >= scrollHeight && hasNextPage) {
        fetchNextPage();
      }
    }
  };

  const handleSearchUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <>
      <UsersSubHeader
        userAmount={userAmount}
        search={search}
        handleSearchUser={handleSearchUser}
        handleClearSearch={handleClearSearch}
      />
      <Flex
        direction="column"
        ref={scrollRef}
        onScroll={onScroll}
        css={{
          height: '100%',
          position: 'relative',
          overflowY: 'auto',
          pr: '$8',
        }}
      >
        <Flex direction="column" gap="8">
          {users.map((user: UserWithTeams) => (
            <UserItem key={user.user._id} userWithTeams={user} />
          ))}
        </Flex>
        {isFetching && (
          <Flex justify="center" css={{ mt: '$16' }}>
            <Dots />
          </Flex>
        )}
      </Flex>
    </>
  );
};

export default UsersList;
