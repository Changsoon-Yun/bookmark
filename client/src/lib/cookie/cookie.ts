import Cookies from 'universal-cookie';
import { UserWidthToken } from '@/components/auth/hooks/useUser';

const cookies = new Cookies();
export const setCookie = (name = 'creative-wallet', value: UserWidthToken | undefined | null) => {
  return cookies.set(name, value, { path: '/' });
};

export const getCookie = (name = 'creative-wallet') => {
  return cookies.get(name);
};

export const deleteCookie = (name = 'creative-wallet') => {
  return cookies.remove(name, { path: '/' });
};
