import { atom } from 'recoil';

import { ToastStateEnum } from '@/enums/toasts/toast-types';

export const toastState = atom({
  key: 'toast',
  default: {
    open: false,
    type: ToastStateEnum.SUCCESS,
    content: '',
  },
});
