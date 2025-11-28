"use client";

import { supabase } from "@/lib/supabaseClient";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface UserContextType {
  currentUser: any;
  setCurrentUser: (user: any) => void; //update user
}

//create context
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

//export Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  //local state
  const [currentUser, setCurrentUser] = useState<any>(null);

  //sync with supabase
  useEffect(() => {
    //get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setCurrentUser(session.user); //update currentUser with logged-in user
    });

    //trigger whenever auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null); //update currentUser to logged-in user or null if they logged out
      }
    );

    //remove listener
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

//export custom hook to reuse useContext
export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
