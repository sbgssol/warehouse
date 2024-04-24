import React, { createContext, useContext, useState, ReactNode } from "react";
import GlobalStrings from "./Globals";

// Define a context for the global state
interface GlobalStateContextType {
  contractName: string;
  setContractName: (name: string) => void;
  getRecordFilename: () => string;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

// Define a provider component to wrap your app
export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contractName, setContractName] = useState<string>("");

  const getRecordFilename = () => {
    return contractName + "_" + GlobalStrings.RecordFileName;
  };

  return (
    <GlobalStateContext.Provider value={{ contractName, setContractName, getRecordFilename }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook to access the global state
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
