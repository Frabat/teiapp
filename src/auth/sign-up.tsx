import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import type { AuthError } from 'firebase/auth';
import { auth } from "../firebase.ts";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setProfile } from "./authSlice.ts";
import { validateSignUpForm, getFirebaseErrorMessage, storeUserProfile } from "./helpers.ts";
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
  Grid
} from '@mui/material';

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  university: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  university?: string;
  general?: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    address: '',
    university: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form
  const validateFormData = (): boolean => {
    const newErrors = validateSignUpForm(formData);
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateFormData()) return;
    
    setIsSubmitting(true);
    setErrors({});

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      const user = userCredential.user;
      
      // Store additional profile data in Firestore
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        university: formData.university,
        email: formData.email,
      };
      
      const profileResult = await storeUserProfile(user.uid, profileData);
      
      if (profileResult.success) {
        // Update Redux state
        dispatch(setUser(user));
        dispatch(setProfile(profileData));
        
        // Navigate to home page after successful signup
        navigate('/');
      } else {
        throw new Error('Failed to store profile data');
      }
      
    } catch (error) {
      const authError = error as AuthError;
      let errorMessage = 'An error occurred during signup. Please try again.';
      
      // Handle specific Firebase auth errors
      errorMessage = getFirebaseErrorMessage(authError.code);
      console.error('Signup error:', authError.code, authError.message);
      
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
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
            Create your account
          </Typography>

          {errors.general && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {errors.general}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Grid container spacing={2}>
              {/* First Name and Last Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  disabled={isSubmitting}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  disabled={isSubmitting}
                />
              </Grid>

              {/* Email */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={isSubmitting}
                />
              </Grid>

              {/* Address */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  name="address"
                  autoComplete="street-address"
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange('address')}
                  error={!!errors.address}
                  helperText={errors.address || 'Enter your full address'}
                  disabled={isSubmitting}
                />
              </Grid>

              {/* University */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="university"
                  label="University"
                  name="university"
                  autoComplete="organization"
                  value={formData.university}
                  onChange={handleInputChange('university')}
                  error={!!errors.university}
                  helperText={errors.university}
                  disabled={isSubmitting}
                />
              </Grid>

              {/* Password */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={!!errors.password}
                  helperText={errors.password || 'Password must be at least 6 characters long'}
                  disabled={isSubmitting}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link component={NavLink} to="/auth/signin" variant="body2">
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp;
