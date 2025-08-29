import { useSelector } from 'react-redux';
import type { RootState } from '../store/store.ts';

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  
  return {
    user,
    isAuthenticated: !!user,
    isLoading,
  };
};
