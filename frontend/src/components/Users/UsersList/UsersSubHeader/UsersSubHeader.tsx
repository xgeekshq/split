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
  <Flex align="end" css={{ mt: '$16' }} data-testid="usersSubHeader" justify="between">
    <Text fontWeight="bold">{userAmount} registered users</Text>
    <Flex css={{ width: '$455' }}>
      <UncontrolledInput
        currentValue={search}
        handleChange={handleSearchUser}
        handleClear={handleClearSearch}
        iconName="search"
        placeholder="Search user"
      />
    </Flex>
  </Flex>
);

export default UsersSubHeader;
