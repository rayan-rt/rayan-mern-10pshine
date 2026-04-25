import { createContext, useContext } from "react";
import type { IUserContext } from "../types/user.types";
// --

const userContext = createContext<IUserContext | undefined>(undefined);

const useUserContext = () => {
  const context = useContext(userContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export { userContext, useUserContext };
