import { Navbar, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import home_svg from "../assets/home.svg";
import import_svg from "../assets/download.svg";
import export_svg from "../assets/up.svg";
import category_svg from "../assets/settings.svg";
import excel_svg from "../assets/doc.svg";
import lock_svg from "../assets/lock.svg";
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

  const { contractName, setContractName, json, lock } = useGlobalState();

  const handleHdChanged = (hd: string) => {
    setContractName(hd);
  };

  const handleLockClick = () => {
    lock.setVerified(false);
    lock.setOpen(true);
  };

  // const handleReloadClick = () => {
  //   window.location.reload();
  // };

  const button_outline = `white`;
  const btn_effect_twstyles =
    "hover:scale-110 hover:bg-transparent active:scale-95 active:bg-transparent focus:outline-none";
  return (
    <Navbar className="max-w-full mb-1 shadow-none sticky top-0 border-b-2 border-b-gray-600 p-1 rounded-none z-50">
      <div className="flex items-center justify-between text-blue-gray-900">
        <div className="flex justify-center items-center space-x-1">
          <Button
            variant="text"
            color="white"
            className={`p-1 ${btn_effect_twstyles}`}
            onClick={handleHomeClick}>
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
            select_class_twstyles="border-2 border-teal-700 rounded-md p-1 text-green-700 font-bold bg-green-50 focus:outline-none"
            option_class_twstyles="font-bold bg-white"></ArrayToSelect>
          <Button
            variant="text"
            color="white"
            ripple={false}
            className={`p-1 ${btn_effect_twstyles}`}
            onClick={handleLockClick}>
            <img src={lock_svg} className={`w-[32px]`} alt="" />
          </Button>
        </div>
        <div className={`space-x-2`}>
          <Button
            variant="text"
            color={`${button_outline}`}
            className={`p-1 ${btn_effect_twstyles}`}
            onClick={handleInpClick}>
            <img src={import_svg} className={`w-[32px]`} />
          </Button>

          <Button
            variant="text"
            color={`${button_outline}`}
            className={`p-1 ${btn_effect_twstyles}`}
            onClick={handleExportClick}>
            <img src={export_svg} className={`w-[32px]`} />
          </Button>

          <Button
            variant="text"
            color={`${button_outline}`}
            className={`p-1 ${btn_effect_twstyles}`}
            onClick={handleReportClick}>
            <img src={excel_svg} className={`w-[32px]`} />
          </Button>

          <Button
            variant="text"
            color={`${button_outline}`}
            className={`p-1 ${btn_effect_twstyles}`}
            onClick={handleCategoryClick}>
            <img src={category_svg} className={`w-[32px]`} />
          </Button>
        </div>
      </div>
    </Navbar>
  );
}
