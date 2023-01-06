import { User } from '@/types/user/user';
import Text from '@/components/Primitives/Text';
import BoxContainer from '../BoxContainer';
import DropdownStakeholders from '../DropdownUsers';

type UsersBoxProps = {
  haveError: boolean;
  participants: User[];
  title: string;
};

const UsersNames = ({ haveError, participants, title }: UsersBoxProps) => (
  <BoxContainer color="white">
    <Text color="primary300" size="xs" css={{ textAlign: 'start' }}>
      {title}
    </Text>
    <Text
      css={{
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textAlign: 'start',
        height: '$64',
      }}
      size="md"
    >
      {!haveError &&
        participants &&
        participants.length > 0 &&
        participants.map((value) => `${value.firstName} ${value.lastName}`).join(', ')}
    </Text>
  </BoxContainer>
);

const UsersBox = ({ haveError, participants, title }: UsersBoxProps) => (
  <>
    {participants.length > 0 ? (
      <DropdownStakeholders users={participants}>
        <UsersNames haveError={haveError} participants={participants} title={title} />
      </DropdownStakeholders>
    ) : (
      <UsersNames haveError={haveError} participants={participants} title={title} />
    )}
  </>
);

export default UsersBox;
