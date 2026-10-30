import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { 
  auth, 
  db, 
  signInWithGoogle, 
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
  const [promptPhoneModal, setPromptPhoneModal] = useState(false);

  useEffect(() => {
    // Run test connection
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
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

  const signIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign-in error:", error);
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
