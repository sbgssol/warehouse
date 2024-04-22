import { Button, Typography } from "@material-tailwind/react";
import import_svg from "../assets/import.svg";
import processing_svg from "../assets/processing.svg";
import product_svg from "../assets/product.svg";
import excel_svg from "../assets/excel.svg";
import { useNavigate } from "react-router-dom";

export default function DashBoard() {
  const item_alignment = `flex flex-col justify-center items-center`;

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

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-2 h-full gap-4 p-4">
        <Button className={`border-4 p-2`} color="cyan" variant="outlined" onClick={handleImportClick}>
          <div className={`bg-cyan-50 w-full h-full rounded-md ${item_alignment}`}>
            <Typography variant="h2">Nhập</Typography>
            <Typography variant="h2">hàng</Typography>
            <img src={import_svg} />
          </div>
        </Button>
        <Button className={`border-4 p-2`} color="amber" variant="outlined" onClick={handleProcessingRelease}>
          <div className={`bg-amber-50 w-full h-full rounded-md ${item_alignment}`}>
            <Typography variant="h2">Xuất</Typography>
            <Typography variant="h2">gia công</Typography>
            <img src={processing_svg} />
          </div>
        </Button>
        <Button className={`border-4 p-2`} color="orange" variant="outlined" onClick={handleProductionRelease}>
          <div className={`bg-orange-50 w-full h-full rounded-md ${item_alignment}`}>
            <Typography variant="h2">Xuất</Typography>
            <Typography variant="h2">thành phẩm</Typography>
            <img src={product_svg} />
          </div>
        </Button>
        <Button className={`border-4 p-2`} color="light-green" variant="outlined" onClick={handleReport}>
          <div className={`bg-green-50 w-full h-full rounded-md ${item_alignment}`}>
            <Typography variant="h2">Tạo</Typography>
            <Typography variant="h2">báo cáo</Typography>
            <img src={excel_svg} />
          </div>
        </Button>
      </div>
    </div>
  );
}
