import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { ChildrenProp } from '@/types/common';
import {
  StyledAccordionItem,
  StyledAccordionHeader,
  StyledAccordionTrigger,
  StyledAccordionIcon,
  StyledAccordionContent,
} from '../../styles';

const ConfigurationSettings = ({ children }: ChildrenProp) => (
  <StyledAccordionItem value="configurations" variant="first">
    <StyledAccordionHeader variant="first">
      <StyledAccordionTrigger>
        <Text heading="5">Configurations</Text>
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

export { ConfigurationSettings };
