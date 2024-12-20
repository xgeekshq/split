import React, { useEffect, useMemo, useRef, useState } from 'react';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Dots from '@/components/Primitives/Loading/Dots/Dots';
import UserItem from '@/components/Users/UsersList/UserItem/UserItem';
import UsersSubHeader from '@/components/Users/UsersList/UsersSubHeader/UsersSubHeader';
import useUsersWithTeams from '@/hooks/users/useUsersWithTeams';
import { UserWithTeams } from '@/types/user/user';

const UsersList = () => {
  const [search, setSearch] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    fetchUsersWithTeams: { data, isFetching, hasNextPage, fetchNextPage, refetch, isError },
    handleErrorOnFetchUsersWithTeams,
  } = useUsersWithTeams(search);
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

  if (isError) {
    handleErrorOnFetchUsersWithTeams();
  }

  return (
    <Flex css={{ overflow: 'hidden' }} direction="column" gap="16">
      <UsersSubHeader
        handleClearSearch={handleClearSearch}
        handleSearchUser={handleSearchUser}
        search={search}
        userAmount={userAmount}
      />
      <Flex
        data-testid="usersList"
        direction="column"
        gap="16"
        onScroll={onScroll}
        ref={scrollRef}
        css={{
          position: 'relative',
          overflowY: 'auto',
        }}
      >
        <Flex direction="column" gap="8">
          {users.map((user: UserWithTeams) => (
            <UserItem key={user.user._id} userWithTeams={user} />
          ))}
        </Flex>
        {isFetching && (
          <Flex justify="center">
            <Dots />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default UsersList;
