import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { User, RegisterForm, LoginForm, ProfileForm, Expertise } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  login: (credentials: LoginForm) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (userData: RegisterForm) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: ProfileForm) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.warn('AuthContext loading timeout - forcing loading to false');
      setLoading(false);
    }, 2000); // 2 second timeout

    // Check if Firebase is initialized
    if (!auth) {
      console.warn('Firebase auth not initialized - skipping authentication check');
      setLoading(false);
      clearTimeout(timeoutId);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      setCurrentUser(user);
      
      if (user && db) {
        // Clear any existing session timeout
        if (sessionTimeout) {
          clearTimeout(sessionTimeout);
        }
        
        // Set session timeout for 8 hours (28800000 ms)
        const timeout = setTimeout(() => {
          console.log('Session timeout - logging out user');
          logout();
        }, 8 * 60 * 60 * 1000); // 8 hours
        
        setSessionTimeout(timeout);
        
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const profileData = userDoc.data();
            setUserProfile({
              ...profileData,
              id: user.uid,
              createdAt: profileData.createdAt?.toDate?.() || new Date(),
              updatedAt: profileData.updatedAt?.toDate?.() || new Date(),
            } as User);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Don't let Firestore errors prevent the app from loading
          setUserProfile(null);
        }
      } else {
        // Clear session timeout when user logs out
        if (sessionTimeout) {
          clearTimeout(sessionTimeout);
          setSessionTimeout(null);
        }
        setUserProfile(null);
      }
      
      console.log('Setting loading to false');
      setLoading(false);
      clearTimeout(timeoutId);
    });

    return () => {
      clearTimeout(timeoutId);
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
      }
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials: LoginForm) => {
    if (!auth) {
      throw new Error('Firebase authentication is not initialized. Please check your configuration.');
    }
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const loginWithGoogle = async () => {
    if (!auth || !db) {
      throw new Error('Firebase authentication is not initialized. Please check your configuration.');
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists, if not create one
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        const userProfile: Omit<User, 'id'> = {
          email: result.user.email || '',
          username: result.user.displayName?.toLowerCase().replace(/\s+/g, '') || '',
          firstName: result.user.displayName?.split(' ')[0] || '',
          lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
          bio: '',
          avatar: result.user.photoURL || '',
          location: '',
          expertise: Expertise.BEGINNER,
          isVerified: false,
          isPremium: false,
          rating: 0,
          reviewCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await setDoc(doc(db, 'users', result.user.uid), userProfile);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const register = async (userData: RegisterForm) => {
    if (!auth || !db) {
      throw new Error('Firebase authentication is not initialized. Please check your configuration.');
    }
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );

      const user = userCredential.user;

      // Create user profile in Firestore
      const userProfile: Omit<User, 'id'> = {
        email: userData.email,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        bio: '',
        avatar: '',
        location: '',
        expertise: Expertise.BEGINNER,
        isVerified: false,
        isPremium: false,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);

      // Update Firebase Auth display name
      await updateProfile(user, {
        displayName: userData.firstName + ' ' + userData.lastName,
      });

    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    if (!auth) {
      throw new Error('Firebase authentication is not initialized. Please check your configuration.');
    }
    try {
      // Clear session timeout
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
        setSessionTimeout(null);
      }
      
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear local state
      setCurrentUser(null);
      setUserProfile(null);
      
      // Clear any stored data
      localStorage.removeItem('firebase:authUser:');
      sessionStorage.clear();
      
      console.log('User logged out and session cleared');
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const updateUserProfile = async (data: ProfileForm) => {
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    if (!db) {
      throw new Error('Firebase database is not initialized. Please check your configuration.');
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date(),
      });

      // Update local state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          ...data,
          updatedAt: new Date(),
        });
      }

      // Update Firebase Auth display name
      await updateProfile(currentUser, {
        displayName: data.firstName + ' ' + data.lastName,
      });

    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth) {
      throw new Error('Firebase authentication is not initialized. Please check your configuration.');
    }
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    updateUserProfile,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 