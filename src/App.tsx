import ImportWarehouse from "./components/ImportWarehouse";
import ProcessingRelease from "./components/ProcessingRelease";
import CreateReport from "./components/CreateReport";
import ProductionRelease from "./components/ProductionRelease";
import { Routes, Route } from "react-router-dom";
import DashBoard from "./components/DashBoard";

export default function App() {
  return (
    <>
      <div className="p-2 h-dvh">
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="import" element={<ImportWarehouse />} />
          <Route path="processing-release" element={<ProcessingRelease />} />
          <Route path="production-release" element={<ProductionRelease />} />
          <Route path="report" element={<CreateReport />} />
          <Route path="*" element={<DashBoard />} />
        </Routes>
      </div>
    </>
  );
}
