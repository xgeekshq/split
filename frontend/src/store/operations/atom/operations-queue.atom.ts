import { atom } from 'recoil';

export const operationsQueueAtom = atom<boolean>({
  key: 'operationsQueueAtom',
  default: true,
});
