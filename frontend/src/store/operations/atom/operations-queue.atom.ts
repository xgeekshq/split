import { atom } from 'recoil';

export const operationsQueueAtom = atom<Boolean>({
  key: 'operationsQueueAtom',
  default: true,
});
