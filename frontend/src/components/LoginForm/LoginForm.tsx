import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { useAuth } from "../../contextAPI/AuthContext";
import { useToast } from "../../contextAPI/ToastContext";
import { sendOtp, verifyOtp } from "../../api/auth";

const roles = [
  { label: "Student", value: "STUDENT" },
  { label: "Mess Secretary", value: "MESS_SECRETARY" },
  { label: "Care Taker", value: "CARE_TAKER" },
  { label: "Mess Supervisor", value: "MESS_SUPERVISOR" },
  { label: "Warden", value: "WARDEN" }
] as const;

const LoginForm = () => {
  const { email, setEmail, otp, setOtp, role, setRole, login } = useAuth();
  const [tempToken, setTempToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSendOtp = async () => {
    if (!email) {
      showToast("Please enter a valid email.", "error");
      return;
    }

    try {
      const response = await sendOtp(email, role ?? "STUDENT");
      setTempToken(response.data.token);
      showToast("OTP sent successfully. Check your email.", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to send OTP. Make sure role and email are correct.", "error");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !tempToken) {
      showToast("Request OTP first and enter the code.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyOtp(otp, tempToken, role ?? "STUDENT");
      const { token, role: verifiedRole, user } = response.data;

      await login({ token, role: verifiedRole, user });
      showToast("Login successful.", "success");

      if (verifiedRole === "WARDEN") {
        navigate("/warden");
      } else if (verifiedRole === "MESS_SECRETARY") {
        navigate("/mess-secretary");
      } else if (verifiedRole === "CARE_TAKER") {
        navigate("/care-taker");
      } else if (verifiedRole === "MESS_SUPERVISOR") {
        navigate("/mess-supervisor");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      showToast("OTP verification failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h2>Sign In</h2>
      <p>Access your dining dashboard and meal plans</p>

      <label>College Email</label>
      <input
        type="email"
        placeholder="user@uohyd.ac.in"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Role</label>
      <select value={role ?? "STUDENT"} onChange={(e) => setRole(e.target.value as "STUDENT" | "MESS_SECRETARY" | "CARE_TAKER" | "MESS_SUPERVISOR" | "WARDEN") }>
        {roles.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <button className="primary-btn" onClick={handleSendOtp}>
        Send OTP →
      </button>

      <div className="divider">VERIFICATION</div>

      <label htmlFor="otp">Enter 6-digit Code</label>

      <input
        id="otp"
        type="text"
        maxLength={6}
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button className="primary-btn" onClick={handleVerifyOtp} disabled={isLoading}>
        {isLoading ? "Verifying..." : "Verify & Continue"}
      </button>

      <p className="resend">⟳ Resend OTP</p>
    </div>
  );
};

export default LoginForm;