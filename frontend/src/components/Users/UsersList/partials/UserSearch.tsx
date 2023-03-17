import SearchInput from '@/components/Primitives/Inputs/SearchInput/SearchInput';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';

type UserSearchProps = {
  userAmount: number | undefined;
  search: string;
  handleSearchUser: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearSearch: () => void;
};

const UserSearch = ({
  userAmount,
  search,
  handleSearchUser,
  handleClearSearch,
}: UserSearchProps) => (
  <Flex css={{ mt: '$16' }} align="end">
    <Text fontWeight="bold" css={{ flex: 1 }}>
      {userAmount} registered users
    </Text>
    <Flex css={{ width: '460px' }}>
      <SearchInput
        placeholder="Search user"
        currentValue={search}
        handleChange={handleSearchUser}
        handleClear={handleClearSearch}
      />
    </Flex>
  </Flex>
);

export default UserSearch;
