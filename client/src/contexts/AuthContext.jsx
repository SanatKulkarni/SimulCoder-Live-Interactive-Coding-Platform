import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService'; // Adjust path if needed

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial auth check

  useEffect(() => {
    const userTokenData = localStorage.getItem('user');
    if (userTokenData) {
      // You might want to verify the token here by calling a /users/me endpoint
      // For simplicity, we'll just set the user if token exists
      // A more robust solution would fetch user profile using the token
      setCurrentUser(JSON.parse(userTokenData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setCurrentUser(data); // data contains access_token and token_type
      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (email, fullName, password) => {
    try {
      const response = await authService.register(email, fullName, password);
      // Optionally log the user in directly after registration
      // await login(email, password);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser, // Or check token validity
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};