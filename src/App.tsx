import Import from "./components/Import";
import CreateReport from "./components/CreateReport";
import { Routes, Route } from "react-router-dom";
import DashBoard from "./components/DashBoard";
import Popup from "./components/single/PopUp";
import CategoryManagement from "./components/CategoryManagement";
import Export from "./components/Export";
import { useEffect } from "react";
import { KeyPress } from "./types/KeyPressHandler";

export default function App() {
  useEffect(() => {
    KeyPress.DisableFunctionKey(["F5"]);

    return () => {};
  }, []);

  return (
    <>
      <div className="p-1 h-full flex flex-col items-center">
        <Popup />
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="import" element={<Import />} />
          <Route path="export" element={<Export />} />
          <Route path="report" element={<CreateReport />} />
          <Route path="category" element={<CategoryManagement />} />
          <Route path="*" element={<DashBoard />} />
        </Routes>
      </div>
    </>
  );
}
