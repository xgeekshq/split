import UncontrolledInput from '@/components/Primitives/Inputs/UncontrolledInput/UncontrolledInput';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';

export type UsersSubHeaderProps = {
  userAmount: number | undefined;
  search: string;
  handleSearchUser: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearSearch: () => void;
};

const UsersSubHeader = ({
  userAmount,
  search,
  handleSearchUser,
  handleClearSearch,
}: UsersSubHeaderProps) => (
  <Flex align="end" data-testid="usersSubHeader" gap="8" justify="between" wrap="wrap">
    <Text fontWeight="bold">{userAmount} registered users</Text>
    <UncontrolledInput
      currentValue={search}
      handleChange={handleSearchUser}
      handleClear={handleClearSearch}
      iconName="search"
      placeholder="Search user"
      width="$456"
    />
  </Flex>
);

export default UsersSubHeader;
