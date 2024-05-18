import { Navbar, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import home_svg from "../assets/home.svg";
import import_svg from "../assets/download.svg";
import export_svg from "../assets/up.svg";
import category_svg from "../assets/settings.svg";
import excel_svg from "../assets/doc.svg";
// import reload_svg from "../assets/refresh.svg";
import { useGlobalState } from "../types/GlobalContext";
import ArrayToSelect from "./ArrayToSelect";

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

  const { contractName, setContractName, json } = useGlobalState();

  const handleHdChanged = (hd: string) => {
    setContractName(hd);
  };

  // const handleReloadClick = () => {
  //   window.location.reload();
  // };

  const button_outline = `teal`;
  return (
    <Navbar className="max-w-full mb-1 shadow-none sticky top-0 border-b-2 border-b-gray-600 p-1 rounded-none z-50">
      <div className="flex items-center justify-between text-blue-gray-900">
        <div className="flex justify-center items-center space-x-1">
          <Button variant="text" color="green" className={`p-1`} onClick={handleHomeClick}>
            <img src={home_svg} className={`w-[32px]`} alt="" />
          </Button>
          {/* <Button variant="text" color="green" className={`p-1`} onClick={handleReloadClick}>
            <img src={reload_svg} className={`w-[32px]`} alt="" />
          </Button> */}
          <ArrayToSelect
            arr={json.rawHopDong ?? [""]}
            remain_old_choice={true}
            label="Chọn một hợp đồng"
            onChange={handleHdChanged}
            default={contractName}
            select_class="border-2 border-teal-700 rounded-md p-1 text-green-700 font-bold bg-green-50"
            option_class="font-bold bg-white"></ArrayToSelect>
        </div>
        <div className={`space-x-2`}>
          <Button
            variant="text"
            color={`${button_outline}`}
            className={`p-1`}
            onClick={handleInpClick}>
            <img src={import_svg} className={`w-[32px]`} />
          </Button>

          <Button
            variant="text"
            color={`${button_outline}`}
            className={`p-1`}
            onClick={handleExportClick}>
            <img src={export_svg} className={`w-[32px]`} />
          </Button>

          <Button
            variant="text"
            color={`${button_outline}`}
            className={`p-1`}
            onClick={handleReportClick}>
            <img src={excel_svg} className={`w-[32px]`} />
          </Button>

          <Button
            variant="text"
            color={`${button_outline}`}
            className={`p-1`}
            onClick={handleCategoryClick}>
            <img src={category_svg} className={`w-[32px]`} />
          </Button>
        </div>
      </div>
    </Navbar>
  );
}
