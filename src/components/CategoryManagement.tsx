import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
  Button
} from "@material-tailwind/react";
import { SetStateAction, useEffect, useState } from "react";
import { NavbarDefault } from "./Navbar";
import GlobalStrings from "../types/Globals";
import edit_icon from "../assets/edit-report-tiny.svg";
import ModifyPopup from "./single/ModifyPopup";
import { useGlobalState } from "../types/GlobalContext";
import { Popup } from "../types/Dialog";
import { FileOperation } from "../types/FileOperation";
import PopUp from "./single/PopUp";
import { dialog } from "@tauri-apps/api";
import { Common } from "../types/GlobalFnc";
import { BaseDirectory } from "@tauri-apps/api/fs";

export default function CategoryManagement() {
  const [open, setOpen] = useState(0);
  const [rawData, setRawData] = useState<string[]>([]);
  const [actualData, setActualData] = useState<string[][]>([]);
  const [pathHopDong, setPathHopDong] = useState<string>("");
  const [hopDongRaw, setHopDongRaw] = useState<string[]>([]);
  // const [fileExist, setFileExist] = useState<boolean>();
  // const [pathJsonData, setPathJsonData] = useState<string>();

  // const [prodMap, setProdMap] = useState<Map<string, { name: string; unit: string }>>(
  //   new Map<string, { name: string; unit: string }>()
  // );

  interface Product {
    code: string;
    name: string;
    unit: string;
  }

  const CategoryInfo = {
    hop_dong: {
      name: "hợp đồng",
      id: 1
    },
    ma_hang: {
      name: "mã hàng",
      id: 2
    },
    noi_xuat: {
      name: "nơi xuất",
      id: 3
    }
  };

  const [product, setProduct] = useState<Product>({ code: "", name: "", unit: "" });
  const [originalProduct, setOriginalProduct] = useState<Product>({ code: "", name: "", unit: "" });

  const { modify, popup } = useGlobalState();

  const handleOpen = (value: SetStateAction<number>) => setOpen(open === value ? 0 : value);

  function Icon({ id, open }: { id: number; open: number }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    );
  }

  const LoadCsv = async (name: string) => {
    const data = await FileOperation.ReadResourceCsvToArr(name);
    data.sort();
    setRawData(data);
  };

  const [jsonExist, setJsonExist] = useState<boolean>();

  useEffect(() => {
    FileOperation.CheckExist(GlobalStrings.NamePathJson, (exist: boolean) => setJsonExist(exist));
    // console.log(`Component mounted`);
    // // 1. Check existing path.json file
    // FileOperation.CheckExist(GlobalStrings.NamePathJson, (exist: boolean) => setFileExist(exist));
    // // 2. Check

    return () => {};
  }, []);

  interface ResourcePath {
    hop_dong: string;
    ma_hang: string;
    noi_xuat: string;
  }

  const RestoreHopDong = async () => {
    const raw = await FileOperation.ReadRawFile(GlobalStrings.NamePathJson);
    const data = JSON.parse(raw) as ResourcePath;
    const full_path = await Common.BaseDiToStr(GlobalStrings.SaveDirectory);
    setPathHopDong(`${full_path}\\${data.hop_dong}`);
  };
  const processJsonExist = async () => {
    console.log(`${GlobalStrings.NamePathJson} exists!`);
    RestoreHopDong();
  };
  const processJsonNotExist = () => {
    console.log(`${GlobalStrings.NamePathJson} does not exist!`);
  };

  useEffect(() => {
    if (jsonExist !== undefined) {
      if (jsonExist) {
        processJsonExist();
      } else {
        processJsonNotExist();
      }
    }

    return () => {};
  }, [jsonExist]);

  // interface ResourcePath {
  //   hop_dong: string;
  //   ma_hang: string;
  //   noi_xuat: string;
  // }

  // useEffect(() => {
  //   if (fileExist !== undefined) {
  //     if (fileExist) {
  //       console.log(`path.json exists!`);
  //       handleReadPathJson();
  //     } else {
  //       console.log(`path.json does NOT exist`);
  //       // 1. Create the json file with default path
  //       const default_data = {
  //         hop_dong: GlobalStrings.NameContractFile,
  //         ma_hang: GlobalStrings.NameProductCodeFile,
  //         noi_xuat: GlobalStrings.NameExportLocation
  //       } as ResourcePath;
  //       // 2. store the json
  //       FileOperation.WriteRawFile(GlobalStrings.NamePathJson, JSON.stringify(default_data), true);
  //     }
  //   }

  //   return () => {};
  // }, [fileExist]);

  // useEffect(() => {
  //   if (pathJsonData !== undefined) {
  //     // restore the data
  //     const data = JSON.parse(pathJsonData) as ResourcePath;
  //     setPathHopDong(data.hop_dong);
  //     console.log(`hopdong: ${data.hop_dong}, mahang: ${data.ma_hang}, noixuat: ${data.noi_xuat}`);
  //   }

  //   return () => {};
  // }, [pathJsonData]);

  useEffect(() => {
    if (open == CategoryInfo.hop_dong.id) {
      // LoadCsv(GlobalStrings.ProductCodeFileName);
    } else if (open == CategoryInfo.ma_hang.id) {
      LoadCsv(GlobalStrings.NameProductCodeFile);
    } else if (open == CategoryInfo.noi_xuat.id) {
      // LoadCsv(GlobalStrings.ProductCodeFileName);
    }
    return () => {};
  }, [open]);

  useEffect(() => {
    let tmp: string[][] = [];
    for (let i = 1; i < rawData.length; ++i) {
      const line = rawData[i];
      const split = line.split(",");

      if (split.every((str) => str.trim().length)) {
        tmp.push(split);
      }
    }

    setActualData(tmp);

    return () => {};
  }, [rawData]);

  const StripeRow = (idx: number) => {
    if (idx % 2 == 0) {
      return "bg-gray-200";
    }
    return "";
  };

  const handleSelectContractFile = async (pathHandler: (path: string) => void) => {
    const selected = await dialog.open({
      defaultPath: await Common.BaseDiToStr(BaseDirectory.Resource),
      filters: [{ name: "CSV", extensions: ["csv"] }],
      multiple: false
    });
    if (selected != null) {
      const path = selected as string;
      pathHandler(path);
      const arr = await FileOperation.ReadCsvToArr(path.slice(path.lastIndexOf("\\") + 1));
      console.log(`[handleContractPathChanged] -> ${arr}`);
    }
  };

  const LoadHopDong = async () => {
    if (pathHopDong !== undefined && pathHopDong.length) {
      const arr = await FileOperation.ReadCsvToArr(
        pathHopDong.slice(pathHopDong.lastIndexOf("\\") + 1)
      );
      console.log(`[LoadHopDong] -> ${arr}`);
      setHopDongRaw(arr);
    }
  };

  useEffect(() => {
    LoadHopDong();

    return () => {};
  }, [pathHopDong]);

  const CreatePathSelector = (
    label: string,
    pathState: string,
    pathHandler: (path: string) => void
  ) => {
    return (
      <div className={`flex items-center w-[90%] mb-1 pb-2`}>
        <span className={``}>{label}</span>
        <input
          type="text"
          disabled={true}
          value={pathState}
          onChange={() => {}}
          className={`w-[73%] focus:outline-none border-2 border-gray-700 bg-gray-200 rounded-md mx-2 px-1 pr-[44px] font-myThin font-bold`}
        />
        <Button
          className={`px-1 py-1 rounded-sm relative -left-[53px]`}
          onClick={() => {
            handleSelectContractFile(pathHandler);
          }}>
          chọn
        </Button>
      </div>
    );
  };

  const CreateAccordionBody = (cat: number) => {
    if (cat == CategoryInfo.ma_hang.id) {
      return (
        <AccordionBody className="pt-0 text-base font-normal flex flex-col items-center">
          {CreatePathSelector("File mã hàng hiện tại:", pathHopDong, setPathHopDong)}
          <table className={`w-full`}>
            <thead className={`uppercase font-myRegular`}>
              <tr>
                <th className={`border border-gray-400 px-2`}>{"stt"}</th>
                <th className={`border border-gray-400 px-2`}>{"mã hàng"}</th>
                <th className={`border border-gray-400 px-2`}>{"tên hàng"}</th>
                <th className={`border border-gray-400 px-2`}>{"đơn vị tính"}</th>
                <th className={`border border-gray-400 px-2`}>{"sửa"}</th>
              </tr>
            </thead>
            <tbody className={`font-myThin`}>
              {actualData.map((line, idx) => (
                <tr key={idx} className={`${StripeRow(idx)}`}>
                  <td className={`border border-gray-400 px-2 max-w-[5%] text-center`}>
                    {idx + 1}
                  </td>
                  <td className={`border border-gray-400 px-2 max-w-[30%]`}>{line[0]}</td>
                  <td className={`border border-gray-400 px-2 max-w-[35%]`}>{line[1]}</td>
                  <td className={`border border-gray-400 px-2 max-w-[15%] text-center`}>
                    {line[2]}
                  </td>
                  <td className={`border border-gray-400 px-2 max-w-[5%] text-center`}>
                    <Button
                      variant="text"
                      className={`p-0`}
                      onClick={() => {
                        setOriginalProduct({ code: line[0], name: line[1], unit: line[2] });
                        setProduct({ code: line[0], name: line[1], unit: line[2] });
                        modify.setType("default");
                        modify.setOpen(true);
                      }}>
                      <img src={edit_icon} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AccordionBody>
      );
    } else if (cat == CategoryInfo.hop_dong.id) {
      return (
        <AccordionBody className="pt-0 text-base font-normal">
          <div className={`flex flex-col items-center`}>
            {CreatePathSelector("File hợp đồng hiện tại:", pathHopDong, setPathHopDong)}
            <table className={`w-[60%] text-center`}>
              <thead>
                <tr className={`capitalize`}>
                  <th className={`border`}>mã hợp đồng</th>
                  <th className={`border`}>sửa</th>
                </tr>
              </thead>
              <tbody>
                {hopDongRaw.map((value, idx) => {
                  return (
                    <tr key={idx}>
                      <td className={`border w-[90%]`}>{value}</td>
                      <td className={`border w-[10%]`}>
                        <Button variant="text" className={`p-0`}>
                          <img src={edit_icon} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </AccordionBody>
      );
    }
    return <AccordionBody className="pt-0 text-base font-normal">1</AccordionBody>;
  };

  const createCategory = (name: string, id: number) => {
    return (
      <Accordion
        open={open === id}
        icon={<Icon id={id} open={open} />}
        className="mb-2 rounded-lg border border-blue-gray-100 px-4">
        <AccordionHeader
          onClick={() => handleOpen(id)}
          className={`border-b-0 transition-colors ${
            open === id ? "text-blue-500 hover:!text-blue-700" : ""
          }`}>
          <Typography variant="h6" className={`font-myRegular capitalize`}>
            {name}
          </Typography>
        </AccordionHeader>
        {CreateAccordionBody(id)}
      </Accordion>
    );
  };

  const CategoryUpdateContent = () => {
    const inp_twstyles =
      "w-full border-2 border-blue-gray-100 rounded-md focus:outline-none focus:border-blue-gray-600 px-2 py-1 font-myThin font-bold";
    return (
      <table className={`w-full`}>
        <tbody>
          <tr>
            <td>
              <div className={`flex py-1 px-2 items-center`}>
                <div className={`w-1/4 font-myRegular font-bold capitalize`}>mã hàng</div>
                <div className={`w-3/4`}>
                  {" "}
                  <input
                    disabled={true}
                    type="text"
                    className={`${inp_twstyles}`}
                    value={product.code}
                    onChange={(e) => {
                      setProduct((prevProduct) => ({
                        ...prevProduct,
                        code: e.target.value
                      }));
                    }}
                  />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className={`flex py-1 px-2 items-center`}>
                <div className={`w-1/4 font-myRegular font-bold capitalize`}>tên hàng</div>
                <div className={`w-3/4`}>
                  {" "}
                  <input
                    type="text"
                    className={`${inp_twstyles}`}
                    value={product.name}
                    onChange={(e) => {
                      setProduct((prevProduct) => ({
                        ...prevProduct,
                        name: e.target.value
                      }));
                    }}
                  />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className={`flex py-1 px-2 items-center`}>
                <div className={`w-1/4 font-myRegular font-bold capitalize`}>đơn vị tính</div>
                <div className={`w-3/4`}>
                  {" "}
                  <input
                    type="text"
                    className={`${inp_twstyles}`}
                    value={product.unit}
                    onChange={(e) => {
                      setProduct((prevProduct) => ({
                        ...prevProduct,
                        unit: e.target.value
                      }));
                    }}
                  />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const handleProductDelete = () => {
    Popup.Error("Chức năng chưa thể sử dụng");
  };
  const handleProductSave = () => {
    // Check changes
    if (
      originalProduct.code == product.code &&
      originalProduct.name == product.name &&
      originalProduct.unit == product.unit
    ) {
      modify.setOpen(false);
      setTimeout(() => {
        popup.show(
          <>
            <Typography>Thông tin không có thay đổi.</Typography>
            <Typography className={`font-bold`}>Thao tác không được thực hiện</Typography>
          </>,
          "info"
        );
      }, 100);
    }
    let tmp = JSON.parse(JSON.stringify(rawData)) as string[];
    rawData.forEach((str, idx) => {
      const s = str.split(",");
      if (
        s[0] == originalProduct.code &&
        s[1] == originalProduct.name &&
        s[2] == originalProduct.unit
      ) {
        tmp[idx] = `${product.code},${product.name},${product.unit}`;
      }
    });
    FileOperation.WriteCsv(GlobalStrings.NameProductCodeFile, GlobalStrings.SaveDirectory, tmp);
    setTimeout(() => {
      modify.setOpen(false);
    }, 100);
    LoadCsv(GlobalStrings.NameProductCodeFile);
  };

  return (
    <>
      <PopUp />
      <ModifyPopup
        deleteHandler={handleProductDelete}
        saveHandler={handleProductSave}
        label={`cập nhật mã hàng`}>
        {CategoryUpdateContent()}
      </ModifyPopup>
      <NavbarDefault />
      <Typography variant="h2" className={`font-myThin font-bold uppercase`}>
        quản lí danh mục
      </Typography>
      {createCategory(CategoryInfo.hop_dong.name, CategoryInfo.hop_dong.id)}
      {createCategory(CategoryInfo.ma_hang.name, CategoryInfo.ma_hang.id)}
      {createCategory(CategoryInfo.noi_xuat.name, CategoryInfo.noi_xuat.id)}
    </>
  );
}
