import { Button, Typography } from "@material-tailwind/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { WarehouseData } from "../types/ImportWarehouseData";
import MultipleProdCodeSelector from "./ProductSelection";
import GlobalStrings from "../types/Globals";
import { NavbarDefault } from "./Navbar";
import SummaryTable from "./SummaryTable";
import SaveButton from "./single/SaveButton";
import { useGlobalState } from "../types/GlobalContext";
import { FileOperation } from "../types/FileOperation";
import { dialog } from "@tauri-apps/api";
import { Common } from "../types/GlobalFnc";
import { BaseDirectory } from "@tauri-apps/api/fs";

export default function ImportWarehouse() {
  // States
  const [hopDongStr, setHopDongStr] = useState("");
  const [billStr, setBillStr] = useState("");
  const [realDateStr, setRealDateStr] = useState("");
  const [docDateStr, setDocDateStr] = useState("");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [importedAmount, setImportedAmount] = useState<number[]>([]);
  const { getRecordFilename } = useGlobalState();
  const { popup, product } = useGlobalState();

  // References
  const contractRef = useRef<HTMLInputElement>(null); // To focus when the program starts
  const realDateRef = useRef<HTMLInputElement>(null); // To initialize to current date
  const docDateRef = useRef<HTMLInputElement>(null); // To initialize to current date
  const inpAmountRef = useRef<HTMLInputElement[]>([]);

  const fixed_text_color = `text-green-700`;
  const fixed_area_bg = "bg-green-100";
  const fixed_area_border = `border-green-200`;
  const fixed_input_outline = `focus:outline-green-300`;
  const fixed_button_bg = "bg-green-800";

  const [currentSessionData, setCurrentSessionData] = useState<WarehouseData.Record>(
    new WarehouseData.Record("", "", "", "")
  );

  // To load the CSV
  const [csvContent, setCsvContent] = useState<string[]>([]);

  const fetchCsvFile = async () => {
    const data = await FileOperation.ReadResourceCsvToArr(GlobalStrings.ProductCodeFileName);
    setCsvContent(data);
  };
  // Load CSV file once this page is mounted
  useEffect(() => {
    fetchCsvFile();
    if (contractRef.current) {
      contractRef.current.focus();
    }
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    if (realDateRef.current) {
      realDateRef.current.value = `${year}-${month}-${day}`;
      setRealDateStr(realDateRef.current.value);
    }
    if (docDateRef.current) {
      docDateRef.current.value = `${year}-${month}-${day}`;
      setDocDateStr(docDateRef.current.value);
    }
    return () => {};
  }, []);

  // To handle the CSV data
  useEffect(() => {
    if (csvContent) {
      const updatedCodeList = new Set<string>();
      const updatedProductMap = new Map(product.map);

      for (let i = 1; i < csvContent.length; ++i) {
        if (csvContent[i].length < 3) continue;
        const line = csvContent[i].split(",");
        const code = line[0].trim();
        const name = line[1].trim();
        const unit = line[2].trim();

        updatedCodeList.add(code); // Add code to updatedCodeList
        updatedProductMap.set(code, { name, unit }); // Add code and its details to updatedProductMap
      }

      // Update the state with the final values
      // setCodeList(Array.from(updatedCodeList).sort());
      product.setMap(updatedProductMap);
    }
  }, [csvContent]); // Run this effect only when csvContent changes

  useEffect(() => {
    // console.log("selectedCodes changed");
    // Update session data
    const tmp = new WarehouseData.Record(hopDongStr, realDateStr, billStr, docDateStr);
    tmp.ClearProduct();
    selectedCodes.forEach((code) => {
      tmp.CreateProduct(code);
    });
    setCurrentSessionData(tmp);

    return () => {};
  }, [selectedCodes]);

  useEffect(() => {
    if (currentSessionData) {
      console.log("Session data updated: " + WarehouseData.ToString(currentSessionData));
    }

    return () => {};
  }, [currentSessionData]);

  // Validation
  const [hopDongValid, setHopDongValid] = useState(false);
  const colorInputHopDong = () => {
    return hopDongValid ? `bg-white ${fixed_input_outline}` : `bg-red-100 focus:outline-red-500`;
  };

  const [soBillValid, setSoBillValid] = useState(false);
  const colorInputSoBill = () => {
    return soBillValid ? `bg-white ${fixed_input_outline}` : `bg-red-100 focus:outline-red-500`;
  };

  const handleSaveClick = () => {
    // Map amount to product
    if (inpAmountRef && currentSessionData && currentSessionData.danh_sach_san_pham.length) {
      const tmp = currentSessionData;
      for (let i = 0; i < inpAmountRef.current.length; ++i) {
        if (inpAmountRef.current[i].value == "") {
          popup.show("Không thể lưu, kiểm tra lại đã đầy đủ số lượng", "error");
          return;
        }
        tmp.danh_sach_san_pham[i].sl_nhap = Number(inpAmountRef.current[i].value);
      }

      // dialog.message("Final data: " + ImportData.ToString(tmp));

      tmp.StoreData(getRecordFilename(), GlobalStrings.SaveDirectory, true);
      // Popup.Info("Xong", "Thông tin");
      popup.show("Xong", "info");
      setCurrentSessionData(new WarehouseData.Record("", ""));
      // window.location.reload();
    } else {
      popup.show("Không thể lưu, danh sách mã hàng trống", "error");
    }
    // let restored = await ImportData.RestoreData(file_name, dir);
    // restored.forEach((rec) => {
    //   dialog.message("Restored: " + ImportData.ToString(rec));
    // });
  };
  const fixedPart = () => {
    return (
      <>
        <div className="flex justify-center">
          <Typography variant="h3" className={`uppercase ${fixed_text_color}`}>
            Nhập kho
          </Typography>
        </div>
        <div className={`border-2 ${fixed_area_border} ${fixed_area_bg} rounded-lg p-2 w-full`}>
          <div className="flex items-center">
            <div className={`w-1/2 pr-2 ${fixed_text_color}`}>Hợp đồng</div>
            <input
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (event.target.value.length < 1) {
                  setHopDongValid(false);
                } else {
                  setHopDongValid(true);
                }
                setHopDongStr(event.target.value);
              }}
              className={`w-1/2 rounded-md p-1 pl-2 ${colorInputHopDong()}`}
              ref={contractRef}></input>
          </div>
          <div className="flex pt-2 items-center">
            <div className={`w-1/2  pr-2 ${fixed_text_color}`}>Số bill</div>
            <input
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (event.target.value.length < 1) {
                  setSoBillValid(false);
                } else {
                  setSoBillValid(true);
                }
                setBillStr(event.target.value);
              }}
              className={`w-1/2 rounded-md p-1 pl-2 ${colorInputSoBill()}`}
              // ref={billRef}
            ></input>
          </div>
          <div className="flex pt-2 items-center">
            <div className={`w-1/2  pr-2 ${fixed_text_color}`}>Ngày nhập thực tế</div>
            <input
              className={`w-1/2 bg-white rounded-md p-1 pl-2 ${fixed_input_outline}`}
              type="date"
              ref={realDateRef}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setRealDateStr(event.target.value);
              }}></input>
          </div>
          <div className="flex pt-2 items-center">
            <div className={`w-1/2  pr-2 ${fixed_text_color}`}>Ngày chứng từ</div>
            <input
              className={`w-1/2 bg-white rounded-md p-1 pl-2 ${fixed_input_outline}`}
              type="date"
              ref={docDateRef}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setDocDateStr(event.target.value);
              }}></input>
          </div>
        </div>
      </>
    );
  };
  const [open, setOpen] = useState(false);
  const handleSelectCodeClick = () => {
    // Open modal
    setOpen(true);
  };

  const handleSelectFromCsv = async () => {
    const selected = await dialog.open({
      defaultPath: await Common.BaseDiToStr(BaseDirectory.Resource),
      filters: [{ name: "CSV", extensions: ["csv"] }],
      multiple: false
    });
    console.log(`Selected file: ${selected}`);
    const data = await FileOperation.ReadCsvToArr(selected as string);
    console.log(
      `read data: ${data}\nValid -> ${data.every((value) => {
        const s = value.split(",");
        return s.every((v) => v.trim().length);
      })}`
    );
    if (
      data.every((value) => {
        const s = value.split(",");
        console.log(`size: ${s.length}, value: ${s}`);

        return s.every((v) => v.trim().length);
      })
    ) {
      let tmp: string[] = [];
      let amt: number[] = [];
      data.forEach((v) => {
        tmp.push(v.split(",")[0]);
        amt.push(Number(v.split(",")[1]));
      });
      setSelectedCodes(tmp);
      setImportedAmount(amt);
    }
  };
  const updatingPart = () => {
    return (
      <>
        <div className={`w-full max-h-[400px] h-min mt-1`}>
          <div>
            <MultipleProdCodeSelector
              open={open}
              closeHandler={setOpen}
              selectedCode={selectedCodes}
              productMap={product.map}
              handleCodeChange={setSelectedCodes}></MultipleProdCodeSelector>
          </div>
          <div className={`flex space-x-2`}>
            <Button
              fullWidth
              onClick={handleSelectCodeClick}
              variant="gradient"
              color="green"
              disabled={!hopDongValid || !soBillValid}
              className={`p-1`}>
              <Typography color="white" variant="h6">
                Chọn mã hàng
              </Typography>
            </Button>
            <Button
              fullWidth
              onClick={handleSelectFromCsv}
              variant="gradient"
              color="green"
              disabled={!hopDongValid || !soBillValid}
              className={`p-1`}>
              <Typography color="white" variant="h6">
                nhập từ file CSV
              </Typography>
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <NavbarDefault></NavbarDefault>
      <div className="w-full h-max overflow-hidden flex flex-col items-center">
        {fixedPart()}
        {updatingPart()}
        <SummaryTable
          data={currentSessionData}
          amount={importedAmount}
          input_ref={inpAmountRef}></SummaryTable>
      </div>
      <SaveButton className={`${fixed_button_bg}`} onClick={handleSaveClick}></SaveButton>
    </>
  );
}
