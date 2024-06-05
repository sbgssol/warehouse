import { Button, Typography } from "@material-tailwind/react";
import import_svg from "../assets/nhap-hang.svg";
import exort_svg from "../assets/xuat-hang.svg";
import excel_svg from "../assets/list.svg";
import category_svg from "../assets/barcode.svg";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { color } from "@material-tailwind/react/types/components/button";
import { useGlobalState } from "../types/GlobalContext";

export default function DashBoard() {
  const { lock } = useGlobalState();
  const navigate = useNavigate();

  const handleImportClick = () => {
    if (lock.verified == false) {
      lock.setOpen(true);
    } else {
      navigate("/import");
    }
  };
  const handleExportClick = () => {
    if (lock.verified == false) {
      lock.setOpen(true);
    } else {
      navigate("/export");
    }
  };
  const handleReport = () => {
    if (lock.verified == false) {
      lock.setOpen(true);
    } else {
      navigate("/report");
    }
  };

  const btn_twstyles = `w-full h-full rounded-md flex flex-row justify-evenly items-center`;

  const handleCategory = () => {
    if (lock.verified == false) {
      lock.setOpen(true);
    } else {
      navigate("/category");
    }
  };

  const font_twstyles = "font-myBold";

  const CreateButton = (
    label: string | ReactNode,
    icon: string,
    color: color,
    handler: () => void
  ) => {
    return (
      <Button
        className={`border-4 p-2 active:scale-95`}
        color={color}
        variant="outlined"
        onClick={() => {
          setTimeout(() => {
            handler();
          }, 200);
        }}>
        <div className={`${btn_twstyles}`}>
          <Typography variant="h2" className={`${font_twstyles}`}>
            {label}
          </Typography>
          <img src={icon} className="w-[128px]" />
        </div>
      </Button>
    );
  };

  const DashBoardBody = () => {
    //
    return (
      <div className="grid grid-cols-2 h-full gap-4 p-4 bg-red">
        {CreateButton(
          <>
            Nhập
            <br />
            hàng
          </>,
          import_svg,
          "amber",
          handleImportClick
        )}
        {CreateButton(
          <>
            Xuất
            <br />
            hàng
          </>,
          exort_svg,
          "light-green",
          handleExportClick
        )}
        {CreateButton(
          <>
            Tạo
            <br />
            báo cáo
          </>,
          excel_svg,
          "blue",
          handleReport
        )}
        {CreateButton(
          <>
            quản lí
            <br />
            danh mục
          </>,
          category_svg,
          "indigo",
          handleCategory
        )}
      </div>
    );
  };

  return <div className="w-full h-[98svh]">{DashBoardBody()}</div>;
}
