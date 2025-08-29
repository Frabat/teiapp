// Email validation helper
export const validateEmail = (email: string): string | undefined => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return undefined;
};

// Password validation helper
export const validatePassword = (password: string, isSignUp: boolean = false): string | undefined => {
  if (!password) return 'Password is required';
  if (isSignUp && password.length < 6) return 'Password must be at least 6 characters long';
  return undefined;
};

// First name validation helper
export const validateFirstName = (firstName: string): string | undefined => {
  if (!firstName) return 'First name is required';
  if (firstName.length < 2) return 'First name must be at least 2 characters long';
  return undefined;
};

// Last name validation helper
export const validateLastName = (lastName: string): string | undefined => {
  if (!lastName) return 'Last name is required';
  if (lastName.length < 2) return 'Last name must be at least 2 characters long';
  return undefined;
};

// Address validation helper
export const validateAddress = (address: string): string | undefined => {
  if (!address) return 'Address is required';
  if (address.length < 10) return 'Address must be at least 10 characters long';
  return undefined;
};

// University validation helper
export const validateUniversity = (university: string): string | undefined => {
  if (!university) return 'University is required';
  if (university.length < 3) return 'University must be at least 3 characters long';
  return undefined;
};

// Form validation helper for sign-up
export const validateSignUpForm = (formData: { 
  email: string; 
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  university: string;
}) => {
  const errors: { 
    email?: string; 
    password?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    university?: string;
  } = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password, true);
  if (passwordError) errors.password = passwordError;
  
  const firstNameError = validateFirstName(formData.firstName);
  if (firstNameError) errors.firstName = firstNameError;
  
  const lastNameError = validateLastName(formData.lastName);
  if (lastNameError) errors.lastName = lastNameError;
  
  const addressError = validateAddress(formData.address);
  if (addressError) errors.address = addressError;
  
  const universityError = validateUniversity(formData.university);
  if (universityError) errors.university = universityError;
  
  return errors;
};

// Form validation helper for sign-in (backward compatibility)
export const validateForm = (formData: { email: string; password: string }, isSignUp: boolean = false) => {
  const errors: { email?: string; password?: string } = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password, isSignUp);
  if (passwordError) errors.password = passwordError;
  
  return errors;
};

// Firebase error message helper
export const getFirebaseErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked. Please allow popups and try again.';
    default:
      return 'An error occurred. Please try again.';
  }
};

// Firestore profile storage helper
export const storeUserProfile = async (
  userId: string, 
  profileData: {
    firstName: string;
    lastName: string;
    address: string;
    university: string;
    email: string;
  }
) => {
  try {
    const { doc, setDoc } = await import('firebase/firestore');
    const { db } = await import('../firebase');
    
    await setDoc(doc(db, 'users', userId), {
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error storing user profile:', error);
    return { success: false, error };
  }
};

// Firestore profile retrieval helper
export const getUserProfile = async (userId: string) => {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const { db } = await import('../firebase');
    
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Type guard to ensure data has the required profile fields
      if (data && 
          typeof data.firstName === 'string' && 
          typeof data.lastName === 'string' && 
          typeof data.address === 'string' && 
          typeof data.university === 'string') {
        return { 
          success: true, 
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            university: data.university,
          } 
        };
      } else {
        return { success: false, data: null };
      }
    } else {
      return { success: false, data: null };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error };
  }
};
