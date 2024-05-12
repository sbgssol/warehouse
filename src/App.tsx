import Import from "./components/Import";
import ProcessingRelease from "./components/ProcessingRelease";
import CreateReport from "./components/CreateReport";
import ProductionRelease from "./components/ProductionRelease";
import { Routes, Route } from "react-router-dom";
import DashBoard from "./components/DashBoard";
import Popup from "./components/single/PopUp";
import CategoryManagement from "./components/CategoryManagement";
import Export from "./components/Export";

export default function App() {
  return (
    <>
      <div className="p-1 h-full flex flex-col items-center">
        <Popup />
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="import" element={<Import />} />
          <Route path="export" element={<Export />} />
          <Route path="processing-release" element={<ProcessingRelease />} />
          <Route path="production-release" element={<ProductionRelease />} />
          <Route path="report" element={<CreateReport />} />
          <Route path="category" element={<CategoryManagement />} />
          <Route path="*" element={<DashBoard />} />
        </Routes>
      </div>
    </>
  );
}
