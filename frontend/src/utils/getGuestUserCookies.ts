import { getCookie } from 'cookies-next';
import { OptionsType } from 'cookies-next/lib/types';

import { GUEST_USER_COOKIE } from '@/constants';

export const getGuestUserCookies = (options?: OptionsType, isServerSide = false) => {
  const cookie = isServerSide
    ? getCookie(GUEST_USER_COOKIE, options)
    : getCookie(GUEST_USER_COOKIE);

  return cookie ? JSON.parse(cookie as string) : cookie;
};
