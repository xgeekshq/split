import Icon from '@/components/icons/Icon';
import { ContentSection, AddNewBoardButton } from '@/components/layouts/DashboardLayout/styles';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';

const ParticipantsLayout: React.FC = ({ children }) => {
  const handleOnClick = () => {};
  return (
    <ContentSection gap="36" justify="between">
      <Flex
        css={{ width: '100%', marginLeft: '152px', marginRight: '152px', mt: '50px' }}
        direction="column"
        gap="40"
      >
        <Flex justify="between">
          <Text heading="1">Participants</Text>
          <AddNewBoardButton size="md" onClick={handleOnClick}>
            <Icon css={{ color: 'white' }} name="plus" />
            Add participants
          </AddNewBoardButton>
        </Flex>
        {children}
      </Flex>
    </ContentSection>
  );
};

export default ParticipantsLayout;
