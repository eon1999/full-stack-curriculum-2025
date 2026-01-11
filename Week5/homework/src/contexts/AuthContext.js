import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();

  const register = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setCurrentUser(userCredential.user);
        navigate("/");
      })
      .catch((error) => {
        setLoginError(error.message);
      });
  };

  // Sign in existing users
  const login = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setCurrentUser(userCredential.user);
        navigate("/");
      })
      .catch((error) => {
        setLoginError(error.message);
      });
  };

  // Sign out users
  const logout = () => {
    signOut(auth).then(() => {
      setCurrentUser(null);
      navigate("/login");
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, loginError, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
