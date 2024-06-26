import React, { createContext, useContext, useState, ReactNode } from "react";
import GlobalStrings from "./Globals";
import { PopupType } from "../components/single/PopUp";

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
    constructProductMap: (data: string[]) => void;
    map: Map<string, { name: string; unit: string }>;
    setMap: (map: Map<string, { name: string; unit: string }>) => void;
    getInfo: (code: string, cat: ProductCat) => string;
  };

  input_code: {
    open: boolean;
    setOpen: (open: boolean) => void;
    show: () => void;
  };

  wait: {
    waiting: boolean;
    setWaiting: (waiting: boolean) => void;
  };

  json: {
    pathHopDong: string | undefined;
    pathMaHang: string | undefined;
    pathNoiXuat: string | undefined;
    setPathHopDong: (path: string) => void;
    setPathMaHang: (path: string) => void;
    setPathNoiXuat: (path: string) => void;
    rawHopDong: string[] | undefined;
    rawMaHang: string[] | undefined;
    rawNoiXuat: string[] | undefined;
    setRawHopDong: (data: string[]) => void;
    setRawMaHang: (data: string[]) => void;
    setRawNoiXuat: (data: string[]) => void;
  };

  lock: {
    open: boolean;
    setOpen: (open: boolean) => void;
    verified: boolean;
    setVerified: (verified: boolean) => void;
  };

  // resources: {
  //   pathHopDong: string;
  //   setPathHopDong: (path: string) => void;
  // };

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

  // Waiting
  const [waiting, setWaiting] = useState(false);

  // Resources
  const [rawHopDong, setRawHopDong] = useState<string[]>();
  const [rawMaHang, setRawMaHang] = useState<string[]>();
  const [rawNoiXuat, setRawNoiXuat] = useState<string[]>();
  const [pathHopDong, setPathHopDong] = useState<string>();
  const [pathMaHang, setPathMaHang] = useState<string>();
  const [pathNoiXuat, setPathNoiXuat] = useState<string>();

  // lock
  const [lock, setLock] = useState(true);
  const [verified, setVerified] = useState(false);

  const getRecordFilename = () => {
    return contractName + "_" + GlobalStrings.RecordFileName;
  };

  const ShowPopUp = (msg: string | ReactNode | ReactNode[], type: PopupType) => {
    setPopupOpen(true);
    setPopupMessage(msg);
    setPopupType(type);
  };

  const GetProductInfo = (code: string, cat: ProductCat) => {
    let res = "KHÔNG TÌM THẤY";
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

  const FetchProductMap = async (data: string[]) => {
    console.log(`[GlobalContext] -> Fetching product map`);

    // const data = rawMaHang ?? [""];
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
          constructProductMap: FetchProductMap
        },
        input_code: {
          open: inputOpen,
          setOpen: setInputOpen,
          show: ShowInputCode
        },
        // resources: {
        //   pathHopDong: pathHopDong,
        //   setPathHopDong: setPathHopDong
        // }
        wait: {
          waiting: waiting,
          setWaiting: setWaiting
        },

        json: {
          rawHopDong: rawHopDong,
          rawMaHang: rawMaHang,
          rawNoiXuat: rawNoiXuat,
          setRawHopDong: setRawHopDong,
          setRawMaHang: setRawMaHang,
          setRawNoiXuat: setRawNoiXuat,
          pathHopDong: pathHopDong,
          pathMaHang: pathMaHang,
          pathNoiXuat: pathNoiXuat,
          setPathHopDong: setPathHopDong,
          setPathMaHang: setPathMaHang,
          setPathNoiXuat: setPathNoiXuat
        },

        lock: {
          open: lock,
          setOpen: setLock,
          verified: verified,
          setVerified: setVerified
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
