import { atom } from 'recoil';

export const sidebarState = atom({
  key: 'sidebar',
  default: {
    collapsed: true,
  },
});
