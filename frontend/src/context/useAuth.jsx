import { createContext, useReducer, useContext, useEffect } from "react";
import axios from "../lib/axiosInstance";
import { reducer, initialState } from "../reducer/auth_reducer";
import { toast } from "react-hot-toast";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const register = async (formData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await axios.post("/auth/register", formData);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
      dispatch({ type: "SET_AUTH_CHECKED", payload: true });
      dispatch({ type: "SET_SUCCESS", payload: res.data.message });
      toast.success("Registration successful! You are logged in.");
      return res.data.user;
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.response?.data?.message || "Registration failed" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await axios.post("/auth/login", { email, password });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
      dispatch({ type: "SET_AUTH_CHECKED", payload: true });
      toast.success("Login successful!");
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.response?.data?.message || "Login failed" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      dispatch({ type: "LOGOUT" });
      toast.success("Logged out successfully");
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const sendVerificationOtp = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await axios.post("/auth/send-verification-otp");
      dispatch({ type: "SET_SUCCESS", payload: res.data.message });
      toast.success("OTP sent to your email");
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.response?.data?.message || "Failed to send OTP" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const verifyOtp = async (otp) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await axios.post("/auth/verify-the-otp", { otp });
      const isVerified = res?.data?.data?.isAccountVerified ?? false;
      dispatch({ type: "ACCOUNT_VERIFIED", payload: isVerified });
      dispatch({ type: "SET_SUCCESS", payload: res.data.message });
      toast.success(res.data?.message || "Account verified successfully!");
      return { success: true, message: res.data?.message, isAccountVerified: isVerified };
    } catch (err) {
      const message = err.response?.data?.message || "OTP verification failed";
      dispatch({ type: "SET_ERROR", payload: message });
      return { success: false, message };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const sendResetOtp = async (email) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await axios.post("/auth/reset-otp", { email });
      dispatch({ type: "SET_SUCCESS", payload: res.data.message });
      toast.success("Reset OTP sent to your email");
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.response?.data?.message || "Failed to send reset OTP" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await axios.post("/auth/reset-password", { email, otp, newPassword });
      dispatch({ type: "SET_SUCCESS", payload: res.data.message });
      toast.success("Password reset successful! Please log in with your new password.");
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.response?.data?.message || "Password reset failed" });
      toast.error(err.response?.data?.message || "Password reset failed");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

 const getProfile = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await axios.get("/auth/me");
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data?.userData });
    } catch (err) {
      dispatch({ type: "LOGOUT" });
      return null;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({ type: "SET_AUTH_CHECKED", payload: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        sendVerificationOtp,
        verifyOtp,
        sendResetOtp,
        resetPassword,
        getProfile,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
