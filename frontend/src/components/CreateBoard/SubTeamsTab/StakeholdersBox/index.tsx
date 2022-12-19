import { User } from '@/types/user/user';
import Text from '@/components/Primitives/Text';
import BoxContainer from '../BoxContainer';
import DropdownStakeholders from '../DropdownStakeholders';

type StakeholdersBoxProps = {
  haveError: boolean;
  stakeholders: User[];
};

const StakeholdersNames = ({ haveError, stakeholders }: StakeholdersBoxProps) => (
  <BoxContainer color="white">
    <Text color="primary300" size="xs" css={{ pb: '$2', textAlign: 'start' }}>
      Stakeholders
    </Text>
    <Text
      css={{
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textAlign: 'start',
      }}
      size="md"
    >
      {!haveError &&
        stakeholders &&
        stakeholders.length > 0 &&
        stakeholders.map((value) => `${value.firstName} ${value.lastName}`).join(', ')}
    </Text>
  </BoxContainer>
);

const StakeholdersBox = ({ haveError, stakeholders }: StakeholdersBoxProps) => (
  <>
    {stakeholders.length > 0 ? (
      <DropdownStakeholders stakeholders={stakeholders}>
        <StakeholdersNames haveError={haveError} stakeholders={stakeholders} />
      </DropdownStakeholders>
    ) : (
      <StakeholdersNames haveError={haveError} stakeholders={stakeholders} />
    )}
  </>
);

export default StakeholdersBox;
