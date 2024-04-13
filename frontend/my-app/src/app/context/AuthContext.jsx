"use client"
import { createContext, useReducer } from "react";
import { useEffect } from "react";
export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
      case "LOGIN":
        return {user: action.payload }; // Merge existing state with the new user data
      case "LOGOUT":
        return {user: null }; // Clear user data on logout
      default:
        return state;
    }
  };

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });
   // Move this inside the function block
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if(user){
        dispatch({type:"LOGIN", payload: user})
    }
  }, [])
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};