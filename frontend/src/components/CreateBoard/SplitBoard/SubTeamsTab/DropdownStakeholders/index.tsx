import Text from '@/components/Primitives/Text';
import { ReactNode } from 'react';
import { User } from '@/types/user/user';
import { Dropdown, DropdownBtn, DropdownContent, DropdownItem } from './styles';

type DropdownStakeholdersProps = {
  children: ReactNode;
  stakeholders: User[];
};

const DropdownStakeholders = ({ children, stakeholders }: DropdownStakeholdersProps) => (
  <Dropdown>
    <DropdownBtn>{children}</DropdownBtn>
    <DropdownContent>
      {stakeholders.map((stakeholder) => (
        <DropdownItem key={stakeholder._id} justify="between" align="center">
          <Text size="sm" weight="medium">
            {`${stakeholder.firstName} ${stakeholder.lastName} `}
          </Text>
          <Text size="xs" color="primary300">{`(${stakeholder.email})`}</Text>
        </DropdownItem>
      ))}
    </DropdownContent>
  </Dropdown>
);

export default DropdownStakeholders;
