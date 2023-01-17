import UsersBox from '@/components/CreateBoard/SplitBoard/SubTeamsTab/UsersBox';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { User } from '@/types/user/user';
import {
  StyledAccordionItem,
  StyledAccordionHeader,
  StyledAccordionTrigger,
  StyledAccordionIcon,
  StyledAccordionContent,
} from '../../styles';

type Props = {
  usersListNames: User[];
};

const ParticipantsSettings = ({ usersListNames }: Props) => (
  <StyledAccordionItem value="participants" variant="first">
    <StyledAccordionHeader variant="first">
      <StyledAccordionTrigger>
        <Text heading="5">Participants</Text>
        <StyledAccordionIcon name="arrow-down" />
      </StyledAccordionTrigger>
    </StyledAccordionHeader>
    <StyledAccordionContent>
      <Flex direction="column" gap={16}>
        <UsersBox haveError={false} participants={usersListNames} title="Participants" />
      </Flex>
    </StyledAccordionContent>
  </StyledAccordionItem>
);

export { ParticipantsSettings };
