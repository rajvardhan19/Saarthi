import React, { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "./supabaseClient";

const AuthModal = ({ onClose }) => {
  const [session, setSession] = useState(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSendOtp = async () => {
    setLoading(true);
    setError(null);
    const fullPhoneNumber = `+91${phone}`;
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: fullPhoneNumber,
    });
    if (error) {
      setError(error.message);
    } else {
      setOtpSent(true);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError(null);
    const fullPhoneNumber = `+91${phone}`;
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      phone: fullPhoneNumber,
      token: otp,
      type: "sms",
    });
    if (error) {
      setError(error.message);
    } else {
      setSession(session);
    }
    setLoading(false);
  };

  if (session) {
    onClose(); // Close the modal when the user is logged in
    return null;
  }

  return (
    <div className="auth-modal">
      <div className="auth-modal-content">
        <span className="auth-modal-close" onClick={onClose}>
          &times;
        </span>
        {otpSent ? (
          <div>
            <h3>Enter OTP</h3>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP"
            />
            <button onClick={handleVerifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            {error && <p className="error">{error}</p>}
          </div>
        ) : (
          <div>
            <h3>Sign in with Phone</h3>
            <div className="phone-input">
              <span>+91</span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            <button onClick={handleSendOtp} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
            {error && <p className="error">{error}</p>}
          </div>
        )}
        <div>
          <h3>Or Sign in with:</h3>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["google", "github"]}
            magicLink={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
