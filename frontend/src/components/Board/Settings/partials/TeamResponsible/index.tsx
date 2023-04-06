import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { ChildrenProp } from '@/types/common';
import {
  StyledAccordionItem,
  StyledAccordionHeader,
  StyledAccordionTrigger,
  StyledAccordionIcon,
  StyledAccordionContent,
} from '@/components/Board/Settings/styles';

const TeamResponsibleSettings = ({ children }: ChildrenProp) => (
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
