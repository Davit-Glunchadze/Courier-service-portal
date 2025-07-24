// src/context/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import type {User } from "@supabase/supabase-js";
import { useAppDispatch } from "../app/hooks";
import { setUserAndRole } from "../features/auth/authSlice";

// კონტექსტი მომხმარებლის მონაცემებისთვისს და ავტორიზაციის სტატუსისთვის
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// კომპონენტი, მომხმარებლის მონაცემებს და ავტორიზაციის სტატუსის
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const syncSession = async () => {
      const { data: sessionData, } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (session?.user) {
        setUser(session.user);
        const role = session.user.user_metadata?.role || null;
        dispatch(setUserAndRole({ user: session.user, role }));
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    syncSession();

    // მონაცემების სინქრონიზაცია ავტორიზაციის ცვლილებებზე
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);

      const role = sessionUser?.user_metadata?.role || null;
      dispatch(setUserAndRole({ user: sessionUser, role }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
