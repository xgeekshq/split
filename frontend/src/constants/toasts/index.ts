import { ToastStateEnum } from '@/utils/enums/toast-types';

const createToastObject = (content: string, type: ToastStateEnum) => {
  return { open: true, content, type };
};

export const createSuccessMessage = (message: string) => {
  return createToastObject(message, ToastStateEnum.SUCCESS);
};

export const createErrorMessage = (message: string) => {
  return createToastObject(message, ToastStateEnum.ERROR);
};

export const createInfoMessage = (message: string) => {
  return createToastObject(message, ToastStateEnum.INFO);
};

export const createWarningMessage = (message: string) => {
  return createToastObject(message, ToastStateEnum.WARNING);
};
