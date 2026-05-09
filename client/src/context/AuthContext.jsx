import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import authReducer, { initialAuthState } from "./authReducer";
import {
  getMeApi,
  loginUserApi,
  logoutUserApi,
  registerUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from "../api/authApi";
import {
  updateProfileApi,
  addAddressApi,
  updateAddressApi,
  deleteAddressApi,
} from "../api/userApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  const loadUser = useCallback(async () => {
    try {
      dispatch({ type: "AUTH_CHECK_START" });
      const data = await getMeApi();
      dispatch({ type: "AUTH_CHECK_SUCCESS", payload: data.user });
    } catch (error) {
      dispatch({ type: "AUTH_CHECK_FAIL" });
    }
  }, []);

  const register = useCallback(async (formData) => {
    try {
      dispatch({ type: "SUBMIT_START" });
      const data = await registerUserApi(formData);
      dispatch({ type: "AUTH_SUCCESS", payload: data.user });
      return { success: true, user: data.user };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Registration failed";
      dispatch({ type: "AUTH_FAIL", payload: message });
      return { success: false, message };
    }
  }, []);

  const login = useCallback(async (formData) => {
    try {
      dispatch({ type: "SUBMIT_START" });
      const data = await loginUserApi(formData);
      dispatch({ type: "AUTH_SUCCESS", payload: data.user });
      return { success: true, user: data.user };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Login failed";
      dispatch({ type: "AUTH_FAIL", payload: message });
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUserApi();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: "LOGOUT_SUCCESS" });
    }
  }, []);

  const forgotPassword = async (email) => {
    try {
      clearError();
      dispatch({ type: "SET_SUBMITTING", payload: true });

      const data = await forgotPasswordApi(email);

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to process forgot password request";

      dispatch({ type: "SET_ERROR", payload: message });

      return {
        success: false,
        message,
      };
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  const resetPassword = async (token, payload) => {
    try {
      clearError();
      dispatch({ type: "SET_SUBMITTING", payload: true });

      const data = await resetPasswordApi(token, payload);

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to reset password";

      dispatch({ type: "SET_ERROR", payload: message });

      return {
        success: false,
        message,
      };
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  const updateProfile = useCallback(async (formData) => {
    try {
      dispatch({ type: "SUBMIT_START" });

      const data = await updateProfileApi(formData);

      dispatch({ type: "USER_UPDATE_SUCCESS", payload: data.user });

      await loadUser();

      return { success: true, message: data.message };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Profile update failed";

      dispatch({ type: "AUTH_FAIL", payload: message });

      return { success: false, message };
    }
  }, [loadUser]);

  const addAddress = useCallback(async (formData) => {
    try {
      dispatch({ type: "SUBMIT_START" });
      const data = await addAddressApi(formData);
      dispatch({ type: "USER_UPDATE_SUCCESS", payload: data.user });
      return { success: true, message: data.message };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Add address failed";
      dispatch({ type: "AUTH_FAIL", payload: message });
      return { success: false, message };
    }
  }, []);

  const updateAddress = useCallback(async (addressId, formData) => {
    try {
      dispatch({ type: "SUBMIT_START" });
      const data = await updateAddressApi(addressId, formData);
      dispatch({ type: "USER_UPDATE_SUCCESS", payload: data.user });
      return { success: true, message: data.message };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Update address failed";
      dispatch({ type: "AUTH_FAIL", payload: message });
      return { success: false, message };
    }
  }, []);

  const deleteAddress = useCallback(async (addressId) => {
    try {
      dispatch({ type: "SUBMIT_START" });
      const data = await deleteAddressApi(addressId);
      dispatch({ type: "USER_UPDATE_SUCCESS", payload: data.user });
      return { success: true, message: data.message };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Delete address failed";
      dispatch({ type: "AUTH_FAIL", payload: message });
      return { success: false, message };
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const value = useMemo(
    () => ({
      ...state,
      register,
      login,
      logout,
      loadUser,
      clearError,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      forgotPassword,
      resetPassword,
    }),
    [
      state,
      register,
      login,
      logout,
      loadUser,
      clearError,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      forgotPassword,
      resetPassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);