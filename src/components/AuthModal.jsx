import React, { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "./supabaseClient";

const AuthModal = ({ onClose }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      onClose(); // Close the modal when the user is logged in
    }
  }, [session, onClose]);

  return (
    <div className="auth-modal">
      <div className="auth-modal-content">
        <span className="auth-modal-close" onClick={onClose}>
          &times;
        </span>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google", "discord", "github"]}
          magicLink={true}
        />
      </div>
    </div>
  );
};

export default AuthModal;
