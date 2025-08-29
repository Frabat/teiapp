import React, { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase.ts';
import { setUser, removeUser, setLoading } from './authSlice.ts';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import type { RootState } from '../store/store.ts';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAuth = true }) => {
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const isAuthenticated = useSelector((state: RootState) => !!state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        dispatch(setUser(user));
        
        // If user is on auth pages, redirect to home page
        if (location.pathname.startsWith('/auth/')) {
          navigate('/', { replace: true });
        }
      } else {
        // User is signed out
        dispatch(removeUser());
        
        // If route requires auth and user is not authenticated, redirect to welcome
        if (requireAuth) {
          navigate('/welcome', { replace: true });
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate, location.pathname, requireAuth]);

  // Set loading to false when component mounts
  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  if (isLoading) {
    return <LoadingSpinner message="Authenticating..." fullHeight />;
  }

  // If route requires auth and user is not authenticated, don't render children
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If route doesn't require auth and user is authenticated, don't render children
  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
