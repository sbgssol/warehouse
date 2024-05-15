import { Button, Typography } from "@material-tailwind/react";
import import_svg from "../assets/nhap-hang.svg";
import exort_svg from "../assets/xuat-hang.svg";
import excel_svg from "../assets/list.svg";
import category_svg from "../assets/barcode.svg";
import { useNavigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { color } from "@material-tailwind/react/types/components/button";
import PleaseWait from "./single/PleaseWait";
import { useGlobalState } from "../types/GlobalContext";
import { FileOperation } from "../types/FileOperation";
import GlobalStrings from "../types/Globals";

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

  const CreateButton = (
    label: string | ReactNode,
    icon: string,
    color: color,
    handler: () => void
  ) => {
    return (
      <Button className={`border-4 p-2`} color={color} variant="outlined" onClick={handler}>
        <div className={`${btn_twstyles}`}>
          <Typography variant="h2" className={`${font_twstyles}`}>
            {label}
          </Typography>
          <img src={icon} className="w-[128px]" />
        </div>
      </Button>
    );
  };

  type ResourceJson = {
    hop_dong: string;
    ma_hang: string;
    noi_xuat: string;
  };

  const { wait, json: resources } = useGlobalState();
  const [resourceFolderExist, setResourceFolderExist] = useState<boolean>();
  const [resoucePath, setResoucePath] = useState<ResourceJson>();

  const CheckResourceFolderExist = async () => {
    setResourceFolderExist(
      await FileOperation.Check.Exist(
        GlobalStrings.NameResourcePath + "\\" + GlobalStrings.NamePathJson
      )
    );
  };

  const CreateResourceDir = async () => {
    const tmp = {
      hop_dong: "hop_dong.txt",
      ma_hang: "ma_hang.txt",
      noi_xuat: "noi_xuat.txt"
    } as ResourceJson;
    await FileOperation.Dir.Create("tmp", "resources");
    await FileOperation.Write.RawData(GlobalStrings.NamePathJson, "resources", JSON.stringify(tmp));
    await FileOperation.Dir.Remove("tmp", "resources");
    await FileOperation.Copy("hop_dong.init", "./resources/hop_dong.txt");
    await FileOperation.Copy("ma_hang.init", "./resources/ma_hang.txt");
    await FileOperation.Copy("noi_xuat.init", "./resources/noi_xuat.txt");
    setResoucePath({ hop_dong: tmp.hop_dong, ma_hang: tmp.ma_hang, noi_xuat: tmp.noi_xuat });
    resources.setPathHopDong(tmp.hop_dong);
    resources.setPathMaHang(tmp.ma_hang);
    resources.setPathNoiXuat(tmp.noi_xuat);
  };

  const ReadJsonInResourcePath = async () => {
    const rs = await FileOperation.Read.RawData(GlobalStrings.NamePathJson, "resources");
    const path = JSON.parse(rs) as ResourceJson;
    setResoucePath({ hop_dong: path.hop_dong, ma_hang: path.ma_hang, noi_xuat: path.noi_xuat });
    resources.setPathHopDong(path.hop_dong);
    resources.setPathMaHang(path.ma_hang);
    resources.setPathNoiXuat(path.noi_xuat);
  };

  const LoadAllResources = async () => {
    console.log(`Loading resources...`);

    if (resoucePath !== undefined) {
      let data = await FileOperation.Read.RawDataWithDelimiter(resoucePath.hop_dong, "resources", [
        "\r\n",
        "\n"
      ]);
      resources.setRawHopDong(data);
      console.log(`\nHopDong:\n${data}`);
      data = await FileOperation.Read.RawDataWithDelimiter(resoucePath.ma_hang, "resources", [
        "\r\n",
        "\n"
      ]);
      resources.setRawMaHang(data);
      console.log(`\nMaHang:\n${data}`);
      data = await FileOperation.Read.RawDataWithDelimiter(resoucePath.noi_xuat, "resources", [
        "\r\n",
        "\n"
      ]);
      resources.setRawNoiXuat(data);
      console.log(`\nNoiXuat:\n${data}`);
    }
    console.log(`-> Done`);
    wait.setWaiting(false);
  };

  // When the component mounted, check for available resources
  useEffect(() => {
    wait.setWaiting(true);
    if (
      resources.rawHopDong !== undefined &&
      resources.rawMaHang !== undefined &&
      resources.rawNoiXuat !== undefined
    ) {
      wait.setWaiting(false);
    } else {
      CheckResourceFolderExist();
    }
    return () => {};
  }, []);

  useEffect(() => {
    if (resourceFolderExist !== undefined) {
      if (resourceFolderExist) {
        console.log(`${GlobalStrings.NameResourcePath} found`);
        ReadJsonInResourcePath();
      } else {
        console.log(`${GlobalStrings.NameResourcePath} NOT found`);
        CreateResourceDir();
      }
    }

    return () => {};
  }, [resourceFolderExist]);

  useEffect(() => {
    if (resoucePath !== undefined) {
      LoadAllResources();
    }
    return () => {};
  }, [resoucePath]);

  const DashBoardBody = () => {
    if (wait.waiting) {
      return <PleaseWait label="Đang tải dữ liệu" />;
    }
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
