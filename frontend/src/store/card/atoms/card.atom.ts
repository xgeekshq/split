import { atom } from 'recoil';

export const onDragCardStart = atom<string>({
  key: 'onDragCardStart',
  default: '',
});
