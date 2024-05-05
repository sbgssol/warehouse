import React, { createContext, useContext, useState, ReactNode } from "react";
import GlobalStrings from "./Globals";
import { PopupType } from "../components/single/PopUp";

// Define a context for the global state
interface GlobalStateContextType {
  contractName: string;
  setContractName: (name: string) => void;
  getRecordFilename: () => string;

  popup: {
    show: (msg: string | ReactNode | ReactNode[], type: PopupType) => void;
    answer: boolean;
    setAnswer: (ans: boolean) => void;
    open: boolean;
    message: string | ReactNode | ReactNode[];
    type?: PopupType;
    setOpen: (open: boolean) => void;
    setMessage: (msg: string | ReactNode | ReactNode[]) => void;
    setType: (type: PopupType) => void;
  };

  // showPopup: (msg: string | ReactNode | ReactNode[], type: PopupType) => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

// Define a provider component to wrap your app
export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contractName, setContractName] = useState<string>("");
  const [popupMessage, setPopupMessage] = useState<string | ReactNode | ReactNode[]>();
  const [popupType, setPopupType] = useState<PopupType | undefined>();
  const [popupOpen, setPopupOpen] = useState(false);
  const [ans, setAns] = useState(false);

  const getRecordFilename = () => {
    return contractName + "_" + GlobalStrings.RecordFileName;
  };

  const ShowPopUp = (msg: string | ReactNode | ReactNode[], type: PopupType) => {
    setPopupOpen(true);
    setPopupMessage(msg);
    setPopupType(type);
  };

  return (
    <GlobalStateContext.Provider
      value={{
        contractName,
        setContractName,
        getRecordFilename,
        popup: {
          show: ShowPopUp,
          answer: ans,
          setAnswer: setAns,
          open: popupOpen,
          message: popupMessage,
          type: popupType,
          setOpen: setPopupOpen,
          setMessage: setPopupMessage,
          setType: setPopupType
        }
      }}>
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
