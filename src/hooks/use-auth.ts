"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  configured: boolean;
}

const notConfiguredError = new Error("Supabase is not configured");

export function useAuth() {
  const [state, setState] = React.useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    configured: true,
  });

  React.useEffect(() => {
    const supabase = createClient();

    if (!supabase) {
      setState({
        user: null,
        session: null,
        loading: false,
        configured: false,
      });
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
        configured: true,
      });
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
        configured: true,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const supabase = createClient();
    if (!supabase) {
      return { data: null, error: notConfiguredError };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: { full_name?: string; role?: string; phone?: string | null }
  ) => {
    const supabase = createClient();
    if (!supabase) {
      return { data: null, error: notConfiguredError };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    const supabase = createClient();
    if (!supabase) {
      return { error: notConfiguredError };
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const signInWithGoogle = async () => {
    const supabase = createClient();
    if (!supabase) {
      return { data: null, error: notConfiguredError };
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    return { data, error };
  };

  const resetPassword = async (email: string) => {
    const supabase = createClient();
    if (!supabase) {
      return { data: null, error: notConfiguredError };
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  };

  return {
    user: state.user,
    session: state.session,
    loading: state.loading,
    configured: state.configured,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
  };
}
