import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { 
  auth, 
  db, 
  signInWithGoogle, 
  checkRedirectAuth,
  logOut, 
  handleFirestoreError, 
  OperationType,
  testConnection 
} from '../firebase/config';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updatePhone: (phone: string, address?: string) => Promise<void>;
  promptPhoneModal: boolean;
  setPromptPhoneModal: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  authError: null,
  clearAuthError: () => {},
  signIn: async () => {},
  signOut: async () => {},
  updatePhone: async () => {},
  promptPhoneModal: false,
  setPromptPhoneModal: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [promptPhoneModal, setPromptPhoneModal] = useState(false);

  useEffect(() => {
    // Run test connection
    testConnection();

    // Check if user just returned from a redirect sign-in flow
    checkRedirectAuth().catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setAuthError(null);
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          let userSnap;
          try {
            userSnap = await getDoc(userDocRef);
          } catch (err) {
            handleFirestoreError(err, OperationType.GET, `users/${currentUser.uid}`);
          }

          if (userSnap && userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            setUserProfile(data);
            if (!data.phone) {
              setPromptPhoneModal(true);
            }
          } else {
            // First time login - auto-create customer profile from Google account
            const newProfile: UserProfile = {
              userId: currentUser.uid,
              name: currentUser.displayName || 'Customer',
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || '',
              phone: currentUser.phoneNumber || '',
              address: '',
              language: 'bn',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            try {
              await setDoc(userDocRef, newProfile);
            } catch (err) {
              handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}`);
            }
            setUserProfile(newProfile);
            if (!currentUser.phoneNumber) {
              setPromptPhoneModal(true);
            }
          }
        } catch (error) {
          console.error("Error synchronizing customer profile:", error);
        }
      } else {
        setUserProfile(null);
        setPromptPhoneModal(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearAuthError = () => setAuthError(null);

  const signIn = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Sign-in error:", error);
      if (error?.code === 'auth/popup-closed-by-user') {
        // User closed the popup, do not show fatal error
        setAuthError(null);
      } else if (error?.code === 'auth/operation-not-allowed') {
        setAuthError('Firebase Console-এ Google Sign-In Provider চালু (Enable) করতে হবে।');
      } else if (error?.code === 'auth/unauthorized-domain') {
        setAuthError('Firebase Console -> Authentication -> Settings -> Authorized Domains-এ বর্তমান ডোমেইন যুক্ত করতে হবে।');
      } else if (error?.message?.includes('invalid')) {
        setAuthError('Firebase Auth Handler ত্রুটি: অনুগ্রহ করে নিশ্চিত করুন Firebase Console-এ Google Provider Enable করা আছে এবং Support Email সেট করা হয়েছে।');
      } else {
        setAuthError(error?.message || 'সাইন-ইন করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await logOut();
      setUser(null);
      setUserProfile(null);
      setAuthError(null);
    } catch (error) {
      console.error("Sign-out error:", error);
      throw error;
    }
  };

  const updatePhone = async (phone: string, address?: string) => {
    if (!user) throw new Error("User must be signed in");
    const userDocRef = doc(db, 'users', user.uid);
    const updates: Partial<UserProfile> = {
      phone,
      ...(address !== undefined ? { address } : {}),
      updatedAt: new Date().toISOString()
    };

    try {
      await updateDoc(userDocRef, updates);
      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
      setPromptPhoneModal(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      authError,
      clearAuthError,
      signIn,
      signOut,
      updatePhone,
      promptPhoneModal,
      setPromptPhoneModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
