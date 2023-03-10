import Flex from '@/components/Primitives/Layout/Flex';
import Text from '@/components/Primitives/Text/Text';
import {
  StyledAccordionItem,
  StyledAccordionHeader,
  StyledAccordionTrigger,
  StyledAccordionIcon,
  StyledAccordionContent,
} from '../../styles';

const TeamResponsibleSettings: React.FC = ({ children }) => (
  <StyledAccordionItem value="responsible">
    <StyledAccordionHeader>
      <StyledAccordionTrigger>
        <Text heading="5">Team Responsible</Text>
        <StyledAccordionIcon name="arrow-down" />
      </StyledAccordionTrigger>
    </StyledAccordionHeader>
    <StyledAccordionContent>
      <Flex direction="column" gap={16}>
        {children}
      </Flex>
    </StyledAccordionContent>
  </StyledAccordionItem>
);

export { TeamResponsibleSettings };
