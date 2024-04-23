import { Button, Typography } from "@material-tailwind/react";
import import_svg from "../assets/import.svg";
import processing_svg from "../assets/processing.svg";
import product_svg from "../assets/product.svg";
import excel_svg from "../assets/excel.svg";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../types/GlobalContext";
import { useState } from "react";
import SelectContract from "./SelectContract";

export default function DashBoard() {
  const navigate = useNavigate();

  const handleImportClick = () => {
    navigate("/import");
  };
  const handleProcessingRelease = () => {
    navigate("/processing-release");
  };
  const handleProductionRelease = () => {
    navigate("/production-release");
  };
  const handleReport = () => {
    navigate("/report");
  };

  const inner_button_dimension = `w-full h-full rounded-md flex flex-col justify-center items-center`;

  const [openDialog, setOpenDialog] = useState(false);

  const { setContractName } = useGlobalState();

  const handleHdChanged = (hd: string) => {
    setContractName(hd);
  };

  const dialogHandler = () => {
    setOpenDialog(false);
  };

  const handleOk = () => {
    setOpenDialog(false);
  };

  return (
    <div className="w-full h-full">
      <SelectContract open={openDialog} handler={dialogHandler} onChange={handleHdChanged} onOkay={handleOk} size="xs"></SelectContract>
      <div className="grid grid-cols-2 h-full gap-4 p-4">
        <Button className={`border-4 p-2`} color="cyan" variant="outlined" onClick={handleImportClick}>
          <div className={`bg-cyan-50 ${inner_button_dimension}`}>
            <Typography variant="h3">Nhập</Typography>
            <Typography variant="h3">hàng</Typography>
            <img src={import_svg} />
          </div>
        </Button>
        <Button className={`border-4 p-2`} color="amber" variant="outlined" onClick={handleProcessingRelease}>
          <div className={`bg-amber-50 ${inner_button_dimension}`}>
            <Typography variant="h3">Xuất</Typography>
            <Typography variant="h3">gia công</Typography>
            <img src={processing_svg} />
          </div>
        </Button>
        <Button className={`border-4 p-2`} color="orange" variant="outlined" onClick={handleProductionRelease}>
          <div className={`bg-orange-50 ${inner_button_dimension}`}>
            <Typography variant="h3">Xuất</Typography>
            <Typography variant="h3">thành phẩm</Typography>
            <img src={product_svg} />
          </div>
        </Button>
        <Button className={`border-4 p-2`} color="light-green" variant="outlined" onClick={handleReport}>
          <div className={`bg-green-50 ${inner_button_dimension}`}>
            <Typography variant="h3">Tạo</Typography>
            <Typography variant="h3">báo cáo</Typography>
            <img src={excel_svg} />
          </div>
        </Button>
      </div>
    </div>
  );
}
