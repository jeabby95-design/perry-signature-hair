import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { auth } from "./config";
import type { UserProfile, UserRole } from "../types/domain";
import {
  createOrUpdateUserProfile,
  getUserProfileById,
} from "./firestore.ts";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    fullName: string,
    email: string,
    password: string,
    role: UserRole,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getFirebaseErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (uid: string) => {
    const existing = await getUserProfileById(uid);
    if (existing) {
      setProfile(existing);
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setProfile(null);
      return;
    }

    const fallbackProfile: UserProfile = {
      uid: currentUser.uid,
      email: currentUser.email ?? "",
      fullName: currentUser.displayName ?? "New User",
      role: "client",
      points: 0,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await createOrUpdateUserProfile(fallbackProfile);
    setProfile(fallbackProfile);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);

      if (authUser) {
        await loadProfile(authUser.uid);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [loadProfile]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(getFirebaseErrorMessage(error));
    }
  }, []);

  const signup = useCallback(
    async (
      fullName: string,
      email: string,
      password: string,
      role: UserRole,
    ) => {
      try {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const profilePayload: UserProfile = {
          uid: credential.user.uid,
          email,
          fullName,
          role,
          points: 0,
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await createOrUpdateUserProfile(profilePayload);
        setProfile(profilePayload);
      } catch (error) {
        throw new Error(getFirebaseErrorMessage(error));
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!auth.currentUser) {
      setProfile(null);
      return;
    }
    await loadProfile(auth.currentUser.uid);
  }, [loadProfile]);

  const value = useMemo(
    () => ({ user, profile, loading, login, signup, logout, refreshProfile }),
    [loading, login, logout, profile, refreshProfile, signup, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
