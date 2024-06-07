import Import from "./components/Import";
import CreateReport from "./components/CreateReport";
import { Routes, Route } from "react-router-dom";
import DashBoard from "./components/DashBoard";
import Popup from "./components/single/PopUp";
import CategoryManagement from "./components/CategoryManagement";
import Export from "./components/Export";
import { useEffect } from "react";
import ResourceLoader from "./components/single/ResourceLoader";
import LockPopup from "./components/single/LockPopup";
import { useGlobalState } from "./types/GlobalContext";
import { KeyPress } from "./types/KeyPressHandler";

export default function App() {
  const { lock } = useGlobalState();
  useEffect(() => {
    KeyPress.CreateShortcut("ctrl + alt + l", () => {
      lock.setVerified(false);
    });
    KeyPress.CreateShortcut("alt + shift + u", () => {
      lock.setVerified(true);
    });

    return () => {};
  }, []);

  return (
    <>
      <div className="p-1 h-full flex flex-col items-center scroll-smooth">
        <ResourceLoader>
          <Popup />
          {/* <LockPopup /> */}
          <Routes>
            <Route path="/" element={lock.verified ? <DashBoard /> : <LockPopup />} />
            <Route path="import" element={lock.verified ? <Import /> : <LockPopup />} />
            <Route path="export" element={lock.verified ? <Export /> : <LockPopup />} />
            <Route path="report" element={lock.verified ? <CreateReport /> : <LockPopup />} />
            <Route
              path="category"
              element={lock.verified ? <CategoryManagement /> : <LockPopup />}
            />
            <Route path="*" element={lock.verified ? <DashBoard /> : <LockPopup />} />
          </Routes>
        </ResourceLoader>
      </div>
    </>
  );
}
