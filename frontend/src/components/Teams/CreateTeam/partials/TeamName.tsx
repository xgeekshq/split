import Input from '@/components/Primitives/Inputs/Input/Input';
import Text from '@/components/Primitives/Text';

const TeamName = () => (
  <>
    <Text css={{ mb: '$12' }} heading="3">
      Team Name
    </Text>

    <Input showCount id="text" maxChars="40" placeholder="Team name" type="text" />
  </>
);

export default TeamName;
