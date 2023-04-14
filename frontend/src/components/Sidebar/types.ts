import { Dispatch, SetStateAction } from 'react';

export type SidebarProps = {
  firstName: string;
  lastName: string;
  email: string;
  strategy: string;
};

export type CollapsibleProps = {
  isCollapsed: boolean;
  handleCollapse: Dispatch<SetStateAction<boolean>>;
};
