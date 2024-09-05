import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../supabase";

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        } else {
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();
          if (error) throw error;
          setUser(user);
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error
            : new Error("An unknown error occurred")
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          setLoading(false);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, loading, error };
}
