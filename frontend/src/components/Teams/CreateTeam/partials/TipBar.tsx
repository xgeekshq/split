import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex';
import Text from '@/components/Primitives/Text/Text';

const CreateTeamTipBar = () => (
  <Flex
    direction="column"
    justify="start"
    css={{
      backgroundColor: '$primary800',
      p: '$32',
      pt: '$100',
      maxWidth: '$384',
    }}
  >
    <Icon name="blob-idea" size={48} />

    <Text heading="6" color="white" css={{ mt: '$24', mb: '$8' }}>
      Team Admin
    </Text>
    <Text color="primary100" size="sm">
      You will be the team admin of this team. You can also choose other team admins later on out of
      your team members.
    </Text>

    <Text heading="6" color="white" css={{ mt: '$24', mb: '$8' }}>
      Stakeholders
    </Text>
    <Text color="primary100" size="sm">
      If you select the role <b>stakeholder</b>, this person will not be included in sub-team retros
      later on when you create a SPLIT retrospective.
    </Text>

    <Text heading="6" color="white" css={{ mt: '$24', mb: '$8' }}>
      New Joiner
    </Text>
    <Text color="primary100" size="sm">
      The new joiner will not be selected as a responsible for the SPLIT sub-teams.
    </Text>
  </Flex>
);

export default CreateTeamTipBar;
