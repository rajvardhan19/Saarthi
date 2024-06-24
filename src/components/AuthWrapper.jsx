import React, { useState, useEffect } from "react";
import supabase from "./supabaseClient";
import AuthModal from "./AuthModal";
import Loader from "./Loader";

const AuthWrapper = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching session:", error);
        setLoading(false);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading)
    return (
      <div>
        {" "}
        <Loader />{" "}
      </div>
    );

  if (!session) {
    return <AuthModal />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
