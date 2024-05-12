import { Button, Typography } from "@material-tailwind/react";
import import_svg from "../assets/nhap-hang.svg";
import exort_svg from "../assets/xuat-hang.svg";
import excel_svg from "../assets/list.svg";
import category_svg from "../assets/barcode.svg";
import { useNavigate } from "react-router-dom";

export default function DashBoard() {
  const navigate = useNavigate();

  const handleImportClick = () => {
    navigate("/import");
  };
  const handleExportClick = () => {
    navigate("/export");
  };
  const handleReport = () => {
    navigate("/report");
  };

  const btn_twstyles = `w-full h-full rounded-md flex flex-row justify-evenly items-center`;

  const handleCategory = () => {
    navigate("/category");
  };

  const font_twstyles = "font-myBold";

  return (
    <>
      <div className="w-full h-[98svh]">
        <div className="grid grid-cols-2 h-full gap-4 p-4 bg-red">
          <Button
            className={`border-4 p-2`}
            color="amber"
            variant="outlined"
            onClick={handleImportClick}>
            <div className={`bg-amber-50 ${btn_twstyles}`}>
              <Typography variant="h3" className={`${font_twstyles}`}>
                Nhập
                <br />
                hàng
              </Typography>
              <img src={import_svg} className="w-[128px]" />
            </div>
          </Button>
          <Button
            className={`border-4 p-2`}
            color="green"
            variant="outlined"
            onClick={handleExportClick}>
            <div className={`bg-green-50 ${btn_twstyles}`}>
              <Typography variant="h3" className={`${font_twstyles}`}>
                Xuất <br /> hàng
              </Typography>
              <img src={exort_svg} className={`w-[128px]`} />
            </div>
          </Button>
          <Button className={`border-4 p-2`} color="blue" variant="outlined" onClick={handleReport}>
            <div className={`bg-blue-50 ${btn_twstyles}`}>
              <Typography variant="h3" className={`${font_twstyles}`}>
                Tạo <br /> báo cáo
              </Typography>
              <img src={excel_svg} className={`w-[128px]`} />
            </div>
          </Button>
          <Button
            className={`border-4 p-2`}
            color="indigo"
            variant="outlined"
            onClick={handleCategory}>
            <div className={`bg-indigo-50 ${btn_twstyles}`}>
              <Typography variant="h3" className={`${font_twstyles}`}>
                quản lí <br /> danh mục
              </Typography>
              <img src={category_svg} className={`w-[128px]`} />
            </div>
          </Button>
        </div>
      </div>
    </>
  );
}
