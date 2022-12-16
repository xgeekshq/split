import { atom } from 'recoil';

export const filteredColumnsState = atom<string[]>({
  key: 'filteredColumns',
  default: [],
});
