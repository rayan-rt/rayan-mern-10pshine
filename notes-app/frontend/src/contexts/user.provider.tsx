import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type {
  IUser,
  IAuthResponse,
  ILoginCredentials,
  IRegisterCredentials,
  IVerifyEmailCredentials,
  IUpdateProfileData,
  IChangePasswordData,
} from "../types/user.types";
import { ENV_VARS } from "../const_env";
import { logger } from "../utils/logger";
import { userContext } from "./user.context";
// --

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch(`${ENV_VARS.BACKEND_URL}/api/v1/users/me`, {
        credentials: "include",
      });

      if (response.ok) {
        const result: IAuthResponse = await response.json();
        if (result.success && result.data) {
          setUser(result.data);
        }
      }
    } catch (err) {
      logger.error("Auth check failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(
    async (data: IRegisterCredentials): Promise<IAuthResponse> => {
      try {
        setLoading(true);
        console.log("req started");
        console.log(ENV_VARS.BACKEND_URL);
        const response = await fetch(
          `${ENV_VARS.BACKEND_URL}/api/v1/users/signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
          },
        );

        const result: IAuthResponse = await response.json();
        console.log(result);
        if (!response.ok) throw new Error(result.message || "Signup failed");
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Signup failed";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const verifyEmail = useCallback(
    async (data: IVerifyEmailCredentials): Promise<IAuthResponse> => {
      try {
        setLoading(true);
        const response = await fetch(
          `${ENV_VARS.BACKEND_URL}/api/v1/users/verify-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
          },
        );

        const result: IAuthResponse = await response.json();
        if (!response.ok)
          throw new Error(result.message || "Verification failed");
        if (result.data) setUser(result.data);
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Verification failed";
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const login = useCallback(
    async (data: ILoginCredentials): Promise<IAuthResponse> => {
      try {
        setLoading(true);
        const response = await fetch(
          `${ENV_VARS.BACKEND_URL}/api/v1/users/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
          },
        );

        const result: IAuthResponse = await response.json();
        console.log(result);

        if ((response.ok || response.status === 403) && result.data) {
          setUser(result.data);
        }

        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Login failed";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await fetch(`${ENV_VARS.BACKEND_URL}/api/v1/users/logout`, {
        method: "GET",
        credentials: "include",
      });

      setUser(null);
    } catch (err: unknown) {
      logger.error("Logout failed:", err);
    }
  }, []);

  const updateProfile = useCallback(
    async (data: IUpdateProfileData): Promise<IAuthResponse> => {
      try {
        const response = await fetch(
          `${ENV_VARS.BACKEND_URL}/api/v1/users/profile`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
          },
        );

        const result: IAuthResponse = await response.json();
        if (result.success && result.data) setUser(result.data);
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Update failed";
        return { success: false, message: errorMessage };
      }
    },
    [],
  );

  const forgotPassword = useCallback(
    async (email: string): Promise<IAuthResponse> => {
      try {
        const response = await fetch(
          `${ENV_VARS.BACKEND_URL}/api/v1/users/forgot-password`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
            credentials: "include",
          },
        );

        return await response.json();
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Request failed";
        return { success: false, message: errorMessage };
      }
    },
    [],
  );

  const resetPassword = useCallback(
    async (token: string, password: string): Promise<IAuthResponse> => {
      try {
        const response = await fetch(
          `${ENV_VARS.BACKEND_URL}/api/v1/users/reset-password/${token}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
            credentials: "include",
          },
        );

        return await response.json();
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Reset failed";
        return { success: false, message: errorMessage };
      }
    },
    [],
  );

  const changePassword = useCallback(
    async (data: IChangePasswordData): Promise<IAuthResponse> => {
      try {
        const response = await fetch(
          `${ENV_VARS.BACKEND_URL}/api/v1/users/change-password`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
          },
        );

        return await response.json();
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Change failed";
        return { success: false, message: errorMessage };
      }
    },
    [],
  );

  const deleteUser = useCallback(async (): Promise<IAuthResponse> => {
    try {
      const response = await fetch(
        `${ENV_VARS.BACKEND_URL}/api/v1/users/profile`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      return await response.json();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Delete failed";
      return { success: false, message: errorMessage };
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      try {
        await checkAuth();
      } catch (err) {
        logger.error("Initial auth check failed:", err);
      }
    };

    if (isMounted) {
      initAuth();
    }

    return () => {
      isMounted = false;
    };
  }, [checkAuth]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      setLoading,
      error,
      setError,
      register: signup,
      login,
      logout,
      verifyEmail,
      updateProfile,
      forgotPassword,
      resetPassword,
      changePassword,
      deleteUser,
    }),
    [
      user,
      loading,
      error,
      signup,
      login,
      logout,
      verifyEmail,
      updateProfile,
      forgotPassword,
      resetPassword,
      changePassword,
      deleteUser,
    ],
  );

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};

export { UserProvider };
