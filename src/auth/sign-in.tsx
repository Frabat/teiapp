import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import type { AuthError } from 'firebase/auth';
import { auth } from "../firebase.ts";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setProfile } from "./authSlice.ts";
import { validateForm, getFirebaseErrorMessage, getUserProfile } from "./helpers.ts";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Link,
  Divider
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  // Validate form
  const validateFormData = (): boolean => {
    const newErrors = validateForm(formData, false);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsGoogleSigningIn(true);
    setErrors({});

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const user = result.user;
      
      // Check if user profile exists in Firestore
      const profileResult = await getUserProfile(user.uid);
      
      if (profileResult.success && profileResult.data) {
        // User has a profile, update Redux state
        dispatch(setUser(user));
        dispatch(setProfile(profileResult.data));
      } else {
        // New Google user, just set the user
        dispatch(setUser(user));
      }
      
      // Navigate to home page after successful signin
      navigate('/');
      
    } catch (error) {
      const authError = error as AuthError;
      let errorMessage = 'An error occurred during Google sign-in. Please try again.';
      
      // Handle specific Firebase auth errors
      errorMessage = getFirebaseErrorMessage(authError.code);
      console.error('Google sign-in error:', authError.code, authError.message);
      
      setErrors({ general: errorMessage });
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateFormData()) return;
    
    setIsSubmitting(true);
    setErrors({});

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      const user = userCredential.user;
      
      // Check if user profile exists in Firestore
      const profileResult = await getUserProfile(user.uid);
      
      if (profileResult.success && profileResult.data) {
        // User has a profile, update Redux state
        dispatch(setUser(user));
        dispatch(setProfile(profileResult.data));
      } else {
        // User without profile, just set the user
        dispatch(setUser(user));
      }
      
      // Navigate to home page after successful signin
      navigate('/');
      
    } catch (error) {
      const authError = error as AuthError;
      let errorMessage = 'An error occurred during signin. Please try again.';
      
      // Handle specific Firebase auth errors
      errorMessage = getFirebaseErrorMessage(authError.code);
      console.error('Signin error:', authError.code, authError.message);
      
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Euripiread
          </Typography>
          
          <Typography component="h2" variant="h6" color="text.secondary" gutterBottom>
            Sign in to your account
          </Typography>

          {errors.general && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {errors.general}
            </Alert>
          )}

          {/* Google Sign-In Button */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={isGoogleSigningIn || isSubmitting}
            sx={{
              mb: 3,
              py: 1.5,
              borderColor: '#4285f4',
              color: '#4285f4',
              '&:hover': {
                borderColor: '#3367d6',
                bgcolor: 'rgba(66, 133, 244, 0.04)',
              },
            }}
          >
            {isGoogleSigningIn ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Signing in with Google...
              </>
            ) : (
              'Sign in with Google'
            )}
          </Button>

          <Divider sx={{ width: '100%', mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              or
            </Typography>
          </Divider>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isSubmitting || isGoogleSigningIn}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              disabled={isSubmitting || isGoogleSigningIn}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting || isGoogleSigningIn}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link component={NavLink} to="/auth/signup" variant="body2">
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignIn;
