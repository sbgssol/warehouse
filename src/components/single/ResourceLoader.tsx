import { ReactNode, useEffect } from "react";
import { useGlobalState } from "../../types/GlobalContext";
import PleaseWait from "./PleaseWait";
import { Common } from "../../types/GlobalFnc";
import { FileOperation } from "../../types/FileOperation";
import GlobalStrings from "../../types/Globals";

interface ResourceLoaderProps {
  children?: ReactNode | ReactNode[];
}

export default function ResourceLoader(props: ResourceLoaderProps) {
  type ResourceJson = {
    hop_dong: string;
    ma_hang: string;
    noi_xuat: string;
  };
  const { json: rsc, wait, product } = useGlobalState();

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
    rsc.setPathHopDong(tmp.hop_dong);
    rsc.setPathMaHang(tmp.ma_hang);
    rsc.setPathNoiXuat(tmp.noi_xuat);
    return { hop_dong: tmp.hop_dong, ma_hang: tmp.ma_hang, noi_xuat: tmp.noi_xuat };
  };

  const ReadJsonInResourcePath = async () => {
    const rs = await FileOperation.Read.RawData(GlobalStrings.NamePathJson, "resources");
    const path = JSON.parse(rs) as ResourceJson;
    rsc.setPathHopDong(path.hop_dong);
    rsc.setPathMaHang(path.ma_hang);
    rsc.setPathNoiXuat(path.noi_xuat);
    return { hop_dong: path.hop_dong, ma_hang: path.ma_hang, noi_xuat: path.noi_xuat };
  };

  const LoadAllResources = async () => {
    const resourceFileIsThere = await FileOperation.Check.Exist(
      `${GlobalStrings.NameResourcePath}\\${GlobalStrings.NamePathJson}`
    );
    Common.Log(`File exist = ${resourceFileIsThere}`);
    let path: ResourceJson;
    if (resourceFileIsThere) {
      path = await ReadJsonInResourcePath();
    } else {
      path = await CreateResourceDir();
    }

    let data = await FileOperation.Read.RawDataWithDelimiter(path.hop_dong, "resources", [
      "\r\n",
      "\n"
    ]);
    rsc.setRawHopDong(data);
    console.log(`\nHopDong:\n${data}`);
    data = await FileOperation.Read.RawDataWithDelimiter(path.ma_hang, "resources", ["\r\n", "\n"]);
    rsc.setRawMaHang(data);
    product.constructProductMap(data);
    console.log(`\nMaHang:\n${data}`);
    data = await FileOperation.Read.RawDataWithDelimiter(path.noi_xuat, "resources", [
      "\r\n",
      "\n"
    ]);
    rsc.setRawNoiXuat(data);
    console.log(`\nNoiXuat:\n${data}`);

    setTimeout(() => {
      wait.setWaiting(false);
    }, 200);
  };

  useEffect(() => {
    wait.setWaiting(true);
    if (
      rsc.pathHopDong === undefined ||
      rsc.pathMaHang === undefined ||
      rsc.pathNoiXuat === undefined
    ) {
      Common.Log(`Resource paths are not initialized`);
      LoadAllResources();
    } else {
      setTimeout(() => {
        wait.setWaiting(false);
      }, 200);
    }

    return () => {};
  }, []);

  const Body = () => {
    if (wait.waiting) {
      return <PleaseWait label="Đang tải dữ liệu" />;
    }
    return <>{props.children}</>;
  };
  return <>{Body()}</>;
}
