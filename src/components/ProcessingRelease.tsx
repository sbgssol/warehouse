import { Button, Typography } from "@material-tailwind/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { dialog } from "@tauri-apps/api";
import { ImportData } from "../types/ImportWarehouseData";
import ProductSelection from "./ProductSelection";
import { ReadCsvToStrArr } from "../types/ReadCsv";
import GlobalStrings from "../types/Globals";
import { NavbarDefault } from "./Navbar";
import SummaryTable from "./SummaryTable";
import SaveButton from "./single/SaveButton";
import { useGlobalState } from "../types/GlobalContext";

export default function ProcessingRelease() {
  // States
  const [hopDongStr, setHopDongStr] = useState("");
  const [rlsDateStr, setRlsDateStr] = useState("");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [csvContent, setCsvContent] = useState<string[]>([]);
  const [csvLocation, setCsvLocation] = useState<string[]>([]);
  const [productCodes, setCodeList] = useState<string[]>([]);
  const [productMap, setProductMap] = useState<
    Map<string, { name: string; unit: string }>
  >(new Map());
  const [currentSessionData, setCurrentSessionData] = useState<ImportData.Data>(
    new ImportData.Data("", "", "", ""),
  );
  const { getRecordFilename } = useGlobalState();
  // References
  const contractRef = useRef<HTMLInputElement>(null);
  const rlsDateRef = useRef<HTMLInputElement>(null);
  const inpAmountRef = useRef<HTMLInputElement[]>([]);
  const rlsSrcRef = useRef<HTMLSelectElement>(null);

  const fixed_text_color = `text-teal-700`;
  const fixed_area_bg = "bg-teal-100";
  const fixed_area_border = `border-teal-200`;
  const fixed_input_outline = `focus:outline-teal-300`;
  const fixed_button_bg = "bg-teal-800";

  const fetchCsvFile = async () => {
    let data = await ReadCsvToStrArr(GlobalStrings.ProductCodeFileName);
    setCsvContent(data);
    data = await ReadCsvToStrArr(GlobalStrings.ReleaseLocationFileName);
    setCsvLocation(data);
  };

  useEffect(() => {
    fetchCsvFile();
    if (contractRef.current) {
      contractRef.current.focus();
    }
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    if (rlsDateRef.current) {
      rlsDateRef.current.value = `${year}-${month}-${day}`;
      setRlsDateStr(rlsDateRef.current.value);
    }

    return () => {};
  }, []);

  // To handle the CSV data
  useEffect(() => {
    if (csvContent) {
      const updatedCodeList = new Set<string>();
      const updatedProductMap = new Map(productMap);

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
      setCodeList(Array.from(updatedCodeList).sort());
      setProductMap(updatedProductMap);
    }
  }, [csvContent]); // Run this effect only when csvContent changes

  enum ProductInfo {
    name,
    unit,
  }
  const getProductInfo = (type: ProductInfo, code: string) => {
    let info = "";
    const tmp = productMap.get(code);
    if (tmp) {
      if (type == ProductInfo.name) {
        info = tmp.name;
      } else if (type == ProductInfo.unit) {
        info = tmp.unit;
      } else {
        info = "??";
      }
    }
    return info;
  };
  useEffect(() => {
    console.log("selectedCodes changed");
    // Update session data
    const tmp = new ImportData.Data(hopDongStr, "-", rlsDateStr, "-");
    tmp.ClearProduct();
    selectedCodes.forEach((code) => {
      tmp.CreateProduct(
        code,
        getProductInfo(ProductInfo.name, code),
        getProductInfo(ProductInfo.unit, code),
      );
    });
    setCurrentSessionData(tmp);

    return () => {};
  }, [selectedCodes]);

  useEffect(() => {
    if (currentSessionData) {
      console.log(
        "Session data updated: " + ImportData.ToString(currentSessionData),
      );
    }

    return () => {};
  }, [currentSessionData]);

  // Validation
  const [hopDongValid, setHopDongValid] = useState(false);
  const colorInputHopDong = () => {
    return hopDongValid ? `bg-white` : `bg-red-100 focus:outline-red-500`;
  };

  const handleNewClick = async () => {
    // Map amount to product
    if (
      inpAmountRef &&
      currentSessionData &&
      currentSessionData.danh_sach_san_pham.length
    ) {
      const tmp = currentSessionData;
      let rls_source;
      if (rlsSrcRef) {
        rls_source = rlsSrcRef.current?.value;
      }
      for (let i = 0; i < inpAmountRef.current.length; ++i) {
        if (inpAmountRef.current[i].value == "") {
          dialog.message("Không thể lưu, kiểm tra lại đã đầy đủ số lượng", {
            type: "error",
            title: "Lỗi",
          });
          return;
        }
        tmp.danh_sach_san_pham[i].noi_xuat = rls_source;
        tmp.danh_sach_san_pham[i].sl_xuat_gc = inpAmountRef.current[i]
          .value as unknown as number;
      }

      // dialog.message("Final data: " + ImportData.ToString(tmp));

      tmp.StoreData(getRecordFilename(), GlobalStrings.SaveDirectory, true);
      dialog.message("Xong");
      // window.location.reload();
    } else {
      dialog.message("Không thể lưu, danh sách mã hàng trống", {
        type: "error",
        title: "Lỗi",
      });
    }
  };

  const updateLocationData = () => {
    return (
      <select
        name="rlsSrc"
        className={`w-1/2 bg-white rounded-md p-1 pl-2 ${fixed_input_outline}`}
        ref={rlsSrcRef}
      >
        <option value="" disabled>
          Chọn nơi xuất hàng
        </option>
        {csvLocation.map((location, index) => (
          <option key={index} value={location.split(",")[0]}>
            {location.split(",")[1]}
          </option>
        ))}
      </select>
    );
  };

  const fixedPart = () => {
    return (
      <>
        <div className="flex justify-center">
          <Typography variant="h3" className={`uppercase ${fixed_text_color}`}>
            Xuất gia công
          </Typography>
        </div>
        <div
          className={`border-2 ${fixed_area_border} ${fixed_area_bg} rounded-lg p-2`}
        >
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
              className={`w-1/2 rounded-md p-1 pl-2 bg-white ${fixed_input_outline} ${colorInputHopDong()}`}
              ref={contractRef}
            ></input>
          </div>
          <div className="flex pt-2 items-center">
            <div className={`w-1/2  pr-2 ${fixed_text_color}`}>Nơi xuất</div>
            {updateLocationData()}
          </div>
          <div className="flex pt-2 items-center">
            <div className={`w-1/2  pr-2 ${fixed_text_color}`}>Ngày xuất</div>
            <input
              className={`w-1/2 bg-white rounded-md p-1 pl-2 ${fixed_input_outline}`}
              type="date"
              ref={rlsDateRef}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setRlsDateStr(event.target.value);
              }}
            ></input>
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
  const updatingPart = () => {
    return (
      <>
        <div className={`w-full max-h-[400px] h-min mt-1`}>
          <div>
            <ProductSelection
              open={open}
              closeHandler={setOpen}
              codeList={productCodes}
              selectedCode={selectedCodes}
              productMap={productMap}
              handleCodeChange={setSelectedCodes}
            ></ProductSelection>
          </div>
          <Button
            fullWidth
            onClick={handleSelectCodeClick}
            variant="gradient"
            color="teal"
            disabled={
              !hopDongValid || !rlsSrcRef || !rlsSrcRef.current?.value.length
            }
            className={`p-1`}
          >
            <Typography color="white" variant="h6">
              Chọn mã hàng
            </Typography>
          </Button>
        </div>
      </>
    );
  };

  return (
    <>
      <NavbarDefault></NavbarDefault>
      <div className="w-full overflow-hidden">
        {fixedPart()}
        {updatingPart()}
        <SummaryTable
          data={currentSessionData}
          input_ref={inpAmountRef}
        ></SummaryTable>
      </div>
      <SaveButton
        className={`${fixed_button_bg}`}
        onClick={handleNewClick}
      ></SaveButton>
    </>
  );
}
