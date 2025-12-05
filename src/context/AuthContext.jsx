import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Token expiration time (7 days in milliseconds)
const TOKEN_EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000;

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("user");
        const tokenExpiry = localStorage.getItem("tokenExpiry");

        // Check if token exists and hasn't expired
        if (storedToken && tokenExpiry) {
          const expiryTime = parseInt(tokenExpiry);
          const currentTime = new Date().getTime();

          if (currentTime < expiryTime) {
            setAuthToken(storedToken);
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          } else {
            // Token expired, clear storage
            clearAuth();
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (token, userData) => {
    try {
      const expiryTime = new Date().getTime() + TOKEN_EXPIRY_TIME;

      // Store token and user data
      localStorage.setItem("authToken", token);
      localStorage.setItem("token", token); // For backward compatibility
      localStorage.setItem("tokenExpiry", expiryTime.toString());

      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("subadminId", userData.id || userData._id);
      }

      setAuthToken(token);
      setUser(userData);

      return true;
    } catch (error) {
      console.error("Error storing auth:", error);
      return false;
    }
  };

  const logout = () => {
    clearAuth();
  };

  const clearAuth = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("user");
    localStorage.removeItem("subadminId");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("token");

    setAuthToken(null);
    setUser(null);
  };

  const getToken = () => {
    // Check if token hasn't expired
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    if (tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry);
      const currentTime = new Date().getTime();

      if (currentTime >= expiryTime) {
        clearAuth();
        return null;
      }
    }
    return authToken || localStorage.getItem("authToken");
  };

  const isAuthenticated = () => {
    const token = getToken();
    return !!token;
  };

  const value = {
    authToken: getToken(),
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
