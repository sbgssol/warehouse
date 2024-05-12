import { Navbar, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import home_svg from "../assets/home.svg";
import import_svg from "../assets/nhap-hang.svg";
import export_svg from "../assets/xuat-hang.svg";
import category_svg from "../assets/barcode.svg";
import excel_svg from "../assets/list.svg";
import { useGlobalState } from "../types/GlobalContext";
import GlobalStrings from "../types/Globals";
import CsvToSelect from "./CsvToSelect";

export function NavbarDefault() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };
  const handleInpClick = () => {
    navigate("/import");
  };
  const handleExportClick = () => {
    navigate("/export");
  };
  const handleReportClick = () => {
    navigate("/report");
  };
  const handleCategoryClick = () => {
    navigate("/category");
  };

  const { contractName, setContractName } = useGlobalState();

  const handleHdChanged = (hd: string) => {
    setContractName(hd);
  };

  const button_outline = `teal`;
  return (
    <Navbar className="max-w-full mb-1 shadow-none sticky top-0 border-b-2 border-b-gray-600 p-1 rounded-none z-50 ">
      <div className="flex items-center justify-between text-blue-gray-900">
        <div className="flex justify-center items-center space-x-2">
          <Button variant="gradient" color="green" className={`p-1`} onClick={handleHomeClick}>
            <img src={home_svg} alt="" />
          </Button>
          <CsvToSelect
            file_name={GlobalStrings.ContractFileName}
            label="Chọn một hợp đồng"
            onChange={handleHdChanged}
            default={contractName}
            select_class="border-2 border-teal-700 rounded-md p-1 text-green-700 font-bold bg-green-50"
            option_class="font-bold bg-white"></CsvToSelect>
        </div>
        <div className={`space-x-2`}>
          <Button
            variant="outlined"
            color={`${button_outline}`}
            className={`p-1`}
            onClick={handleInpClick}>
            <img src={import_svg} className={`w-[24px]`} />
          </Button>

          <Button
            variant="outlined"
            color={`${button_outline}`}
            className={`p-1`}
            onClick={handleExportClick}>
            <img src={export_svg} className={`w-[24px]`} />
          </Button>

          <Button
            variant="outlined"
            color={`${button_outline}`}
            className={`p-1`}
            onClick={handleReportClick}>
            <img src={excel_svg} className={`w-[24px]`} />
          </Button>

          <Button
            variant="outlined"
            color={`${button_outline}`}
            className={`p-1`}
            onClick={handleCategoryClick}>
            <img src={category_svg} className={`w-[24px]`} />
          </Button>
        </div>
      </div>
    </Navbar>
  );
}
