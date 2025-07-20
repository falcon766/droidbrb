import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { User, RegisterForm, LoginForm, ProfileForm } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  login: (credentials: LoginForm) => Promise<void>;
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const profileData = userDoc.data() as User;
            setUserProfile({
              ...profileData,
              createdAt: profileData.createdAt.toDate(),
              updatedAt: profileData.updatedAt.toDate(),
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (credentials: LoginForm) => {
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const register = async (userData: RegisterForm) => {
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
        expertise: 'BEGINNER' as const,
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
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const updateUserProfile = async (data: ProfileForm) => {
    if (!currentUser) {
      throw new Error('No user logged in');
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