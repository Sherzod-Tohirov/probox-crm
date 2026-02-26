import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, setUser } from '@store/slices/authSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../services/authService';
import { resetLeadsPage } from '@store/slices/leadsPageSlice';

export default function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: login,
    onError: (error) => {
      console.log('Error while logging in: ', error);
    },
    onSuccess: (response) => {
      if (!response?.data) return;
      dispatch(setUser(response));
      // Clear any user-scoped cached data and persisted leads UI state on login switch
      try {
        queryClient.clear();
      } catch (_) {
        console.log(_);
      }
      dispatch(resetLeadsPage());
      try {
        localStorage.removeItem('leadsFilterOpen');
      } catch (_) {
        console.log(_);
      }
    },
  });
  const handleLogin = useCallback(
    async (credentials) => {
      mutation.mutate(credentials);
    },
    [mutation]
  );

  const handleLogout = useCallback(async () => {
    // await logout();
    // Clear cached queries and any persisted per-page state
    try {
      queryClient.clear();
    } catch (_) {
      console.log(_);
    }
    dispatch(resetLeadsPage());
    try {
      localStorage.removeItem('leadsFilterOpen');
    } catch (_) {
      console.log(_);
    }
    try {
      localStorage.removeItem('messengerDelayNoticeDismissed');
    } catch (_) {
      console.log(_);
    }
    dispatch(logoutUser());
  }, [dispatch, queryClient]);

  return {
    user,
    isAuthenticated,
    loginState: mutation,
    handleLogin,
    handleLogout,
  };
}
