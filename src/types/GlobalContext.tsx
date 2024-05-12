import React, { createContext, useContext, useState, ReactNode } from "react";
import GlobalStrings from "./Globals";
import { PopupType } from "../components/single/PopUp";
import { FileOperation } from "./FileOperation";

// Define a context for the global state
export type ModifyType = "default" | "edit" | "delete";
export type ProductCat = "name" | "unit";

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

  modify: {
    show: () => void;
    type: ModifyType;
    setType: (type: ModifyType) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
  };

  product: {
    fetch: () => void;
    map: Map<string, { name: string; unit: string }>;
    setMap: (map: Map<string, { name: string; unit: string }>) => void;
    getInfo: (code: string, cat: ProductCat) => string;
  };

  input_code: {
    open: boolean;
    setOpen: (open: boolean) => void;
    show: () => void;
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
  // Modify popup
  const [modOpen, setModOpen] = useState(false);
  const [type, setType] = useState<ModifyType>("edit");

  // Product
  const [map, setMap] = useState(new Map<string, { name: string; unit: string }>());

  // Input code
  const [inputOpen, setInputOpen] = useState(false);
  const ShowInputCode = () => {
    setInputOpen(true);
  };

  const getRecordFilename = () => {
    return contractName + "_" + GlobalStrings.RecordFileName;
  };

  const ShowPopUp = (msg: string | ReactNode | ReactNode[], type: PopupType) => {
    setPopupOpen(true);
    setPopupMessage(msg);
    setPopupType(type);
  };

  const GetProductInfo = (code: string, cat: ProductCat) => {
    let res = "LỖI";
    const tmp = map.get(code);
    if (tmp !== undefined) {
      if (cat == "name") {
        res = tmp.name;
      } else if (cat == "unit") {
        res = tmp.unit;
      }
    }
    return res;
  };

  const FetchProductMap = async () => {
    console.log(`[GlobalContext] -> Fetching product map`);

    const data = await FileOperation.ReadResourceCsvToArr(GlobalStrings.ProductCodeFileName);
    let tmp = new Map<string, { name: string; unit: string }>();
    data.forEach((line) => {
      const s = line.split(",");
      if (s.length == 3) {
        tmp.set(s[0], { name: s[1], unit: s[2] });
      }
    });
    console.log(`[GlobalContext] -> Fetching product map -> Done:\n${JSON.stringify(tmp)}`);
    setMap(tmp);
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
        },
        modify: {
          show: () => {},
          type: type,
          setType: setType,
          open: modOpen,
          setOpen: setModOpen
        },
        product: {
          map: map,
          setMap: setMap,
          getInfo: GetProductInfo,
          fetch: FetchProductMap
        },
        input_code: {
          open: inputOpen,
          setOpen: setInputOpen,
          show: ShowInputCode
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
