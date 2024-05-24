import { Typography, Button, Radio, CardBody, Card } from "@material-tailwind/react";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { FileOperation } from "../types/FileOperation";
import { useGlobalState } from "../types/GlobalContext";
import { WarehouseData } from "../types/ImportWarehouseData";
import { NavbarDefault } from "./Navbar";
import MultipleProdCodeSelector from "./ProductSelection";
import SummaryTable from "./SummaryTable";
import SaveButton from "./single/SaveButton";
import TypeProductCodeModal from "./single/TypeProductCodeModal";
import { Common } from "../types/GlobalFnc";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ListSelect from "./single/ListSelect";
import { WorkBook } from "xlsx";

export default function Export() {
  // States
  const [hopDongStr, setHopDongStr] = useState("");
  const [dateRelease, setDateRelease] = useState(new Date());
  const [selectedCodes, setSelectedCodes] = useState<string[]>();
  const [importedAmount, setImportedAmount] = useState<number[]>([]);
  const [csvContent, setCsvContent] = useState<string[]>([]);
  const [csvLocation, setCsvLocation] = useState<string[]>([]);
  const [locationSet, setLocationSet] = useState<Set<string>>(new Set<string>());
  // const [productCodes, setCodeList] = useState<string[]>([]);
  const [productMap, setProductMap] = useState<Map<string, { name: string; unit: string }>>(
    new Map()
  );
  const [currentSessionData, setCurrentSessionData] = useState<WarehouseData.Record>();
  const [multipleRecords, setMultipleRecords] = useState<WarehouseData.Record[]>([]);
  const { getRecordFilename, popup, input_code, json } = useGlobalState();
  const [exportGC, setExportTypeRadio] = useState(true);
  const [sheetSelectOpen, setSheetSelectOpen] = useState(false);

  // References
  const contractRef = useRef<HTMLInputElement>(null);
  // const rlsDateRef = useRef<HTMLInputElement>(null);
  const inpAmountRef = useRef<HTMLInputElement[]>([]);
  const rlsSrcRef = useRef<HTMLSelectElement>(null);

  // const fixed_text_color = `text-teal-700`;
  // const fixed_area_bg = "bg-teal-100";
  // const fixed_area_border = `border-teal-200`;
  // const fixed_input_outline = `focus:outline-teal-300`;
  // const fixed_button_bg = "bg-teal-800";

  const LabelColor = () => {
    return exportGC ? "text-blue-600" : "text-green-600";
  };
  const RegularTextColor = () => {
    return exportGC ? "text-blue-400" : "text-green-400";
  };
  const ButtonBackgroundColor = () => {
    return exportGC ? "bg-blue-400" : "bg-green-400";
  };
  const BorderColor = () => {
    return exportGC ? "border-blue-700" : "border-green-700";
  };
  const OutlineColor = () => {
    return exportGC ? "focus:outline-blue-700" : "focus:outline-green-700";
  };
  const SaveButtonStyle = () => {
    const gc_twstyles = "text-blue-600 border-blue-600 hover:bg-blue-50";
    const tp_twstyles = "text-green-600 border-green-600 hover:bg-green-50";
    return exportGC ? gc_twstyles : tp_twstyles;
  };

  const fetchCsvFile = async () => {
    console.log(
      `Check json data: son.rawNoiXuat !== undefined -> ${json.rawNoiXuat !== undefined}\
      json.rawMaHang !== undefined -> ${json.rawMaHang !== undefined}`
    );

    if (json.rawNoiXuat !== undefined) {
      setCsvLocation(json.rawNoiXuat);
      const tmp: Set<string> = new Set<string>();
      json.rawNoiXuat.forEach((value) => {
        tmp.add(value.split(",")[0]);
      });
      setLocationSet(tmp);
    }
    if (json.rawMaHang !== undefined) {
      setCsvContent(json.rawMaHang);
    }
  };

  useEffect(() => {
    fetchCsvFile();
    if (contractRef.current) {
      contractRef.current.focus();
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
      // setCodeList(Array.from(updatedCodeList).sort());
      setProductMap(updatedProductMap);
    }
  }, [csvContent]); // Run this effect only when csvContent changes

  useEffect(() => {
    // console.log("selectedCodes changed");
    // Update session data
    if (selectedCodes !== undefined) {
      inpAmountRef.current = [];
      const tmp = new WarehouseData.Record(hopDongStr, Common.DateToString(dateRelease));
      tmp.ClearProduct();
      selectedCodes.forEach((code) => {
        tmp.CreateProduct(code);
      });
      setCurrentSessionData(tmp);
    }

    return () => {};
  }, [selectedCodes]);

  // useEffect(() => {
  //   if (currentSessionData) {
  //     product.constructProductMap(json.rawMaHang ?? [""]);
  //     console.log("Session data updated: " + WarehouseData.ToString(currentSessionData));
  //   }

  //   return () => {};
  // }, [currentSessionData]);

  useEffect(() => {
    if (multipleRecords.length) {
      MultipleRecordsIdxHandler(0);
    }

    return () => {};
  }, [multipleRecords]);

  const MultipleRecordsIdxHandler = (idx: number) => {
    const record = multipleRecords[idx];
    Common.Log(`Record at idx = ${idx}\n${WarehouseData.ToString(record)}`);
    setHopDongStr(record.hop_dong);
    if (rlsSrcRef && rlsSrcRef.current) {
      const location = multipleRecords[idx].danh_sach_san_pham[idx].noi_xuat ?? "";
      if (locationSet.has(location)) {
        rlsSrcRef.current.value = location;
      } else {
        popup.show(
          `Không tìm thấy nơi xuất hàng "${location}"\nHãy kiểm tra lại dữ liệu!`,
          "warning"
        );
      }
    }
    setDateRelease(Common.DateFromString(record.ngay_thuc_te, "-"));
    let amt: number[] = [];
    record.danh_sach_san_pham.forEach((re) => {
      if (exportGC) {
        amt.push(Number(re.sl_xuat_gc));
      } else {
        amt.push(Number(re.sl_xuat_tp));
      }
    });
    setImportedAmount(amt);
    setCurrentSessionData(multipleRecords[idx]);
  };

  // Validation
  const [hopDongValid, setHopDongValid] = useState(false);

  const handleSaveClick = async () => {
    if (currentSessionData === undefined) return;
    let res: FileOperation.SaveResult = "unknown";
    if (multipleRecords.length) {
      for (let i = 0; i < multipleRecords.length; ++i) {
        // const record = multipleRecords[i];
        res = await FileOperation.StoreRecordToDisk(
          getRecordFilename(),
          multipleRecords[i],
          exportGC ? "export-processing" : "export-production"
        );
        if (res != "success") {
          break;
        }
      }
    } else {
      res = await FileOperation.StoreRecordToDisk(
        getRecordFilename(),
        currentSessionData,
        exportGC ? "export-processing" : "export-production",
        inpAmountRef
      );
    }
    switch (res) {
      case "success":
        break;
      case "amount_error":
        popup.show("Không thể lưu, kiểm tra lại số lượng", "error");
        break;
      default:
        popup.show("Có lỗi xảy ra, hãy thử lại", "error");
        break;
    }
    if (res == "success") {
      popup.show("xong", "info");
      setHopDongStr("");
      // setBillStr("");
      // setRlsDateStr("");
      // setDocDateStr("");
      setSelectedCodes([]);
      setImportedAmount([]);
      setCurrentSessionData(new WarehouseData.Record("", ""));
      setMultipleRecords([]);
      setTimeout(() => {
        popup.setOpen(false);
      }, 1000);
    }
  };

  const updateLocationData = () => {
    return (
      <select
        name="rlsSrc"
        className={`w-full bg-white rounded-md p-1.5 pl-2 border-2 ${BorderColor()} ${OutlineColor()}`}
        ref={rlsSrcRef}>
        <option value="" disabled>
          Chọn nơi xuất hàng
        </option>
        {csvLocation.map((location, index) => (
          <option key={index} value={location.split(",")[0]}>
            {location.split(",")[0]}
          </option>
        ))}
      </select>
    );
  };
  const colorInputHopDong = () => {
    return hopDongValid
      ? `bg-white ${OutlineColor()}`
      : `bg-red-100 border-red-500 focus:outline-red-500`;
  };
  useEffect(() => {
    if (hopDongStr.length) {
      setHopDongValid(true);
    } else {
      setHopDongValid(false);
    }

    return () => {};
  }, [hopDongStr]);

  const fixedPart = (label: string) => {
    return (
      <>
        <div className="flex justify-center w-full">
          <Typography variant="h3" className={`uppercase ${LabelColor()}`}>
            {label}
          </Typography>
        </div>
        <div className={`border-2 ${BorderColor()} rounded-lg p-2 w-full`}>
          <div className="flex items-center">
            <div className={`w-1/3 pr-2 ${RegularTextColor()}`}>Hợp đồng</div>
            <input
              value={hopDongStr}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (event.target.value.length < 1) {
                  setHopDongValid(false);
                } else {
                  setHopDongValid(true);
                }
                setHopDongStr(event.target.value);
              }}
              className={`w-full rounded-md p-1 pl-2 border-2 ${colorInputHopDong()} ${BorderColor()} ${OutlineColor()}`}
              ref={contractRef}></input>
          </div>
          <div className="flex pt-2 items-center">
            <div className={`w-1/3  pr-2 ${RegularTextColor()}`}>Nơi xuất</div>
            {updateLocationData()}
          </div>
          <div className="flex pt-2 items-center">
            <div className={`w-1/3  pr-2 ${RegularTextColor()}`}>Ngày xuất</div>
            <div className={`w-full`}>
              <DatePicker
                className={`rounded-md p-1 pl-2 ${OutlineColor()}`}
                selected={dateRelease}
                onChange={(date) => {
                  if (date) {
                    setDateRelease(date);
                  }
                }}
                dateFormat={"dd-MMM-yyyy"}
              />
            </div>
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
  const handleReadExcel = async () => {
    const data = await FileOperation.OpenExcelAndGetSheetName();
    if (data.sheets.length) {
      setSheetNames(data.sheets);
      setWorkbook(data.workbook);
      setSheetSelectOpen(true);
    }
  };
  const updatingPart = () => {
    return (
      <div className={`w-full max-h-[400px] h-min mt-1`}>
        <div>
          <MultipleProdCodeSelector
            open={open}
            closeHandler={setOpen}
            selectedCode={selectedCodes ?? []}
            handleCodeChange={setSelectedCodes}></MultipleProdCodeSelector>
        </div>
        <div className={`flex space-x-2`}>
          <Button
            fullWidth
            onClick={handleSelectCodeClick}
            disabled={!hopDongValid || !rlsSrcRef || !rlsSrcRef.current?.value.length}
            className={`p-1 ${ButtonBackgroundColor()}`}>
            <Typography color="white" variant="h6">
              Chọn mã hàng
            </Typography>
          </Button>
          <Button
            fullWidth
            onClick={() => {
              input_code.show();
            }}
            disabled={!hopDongValid || !rlsSrcRef || !rlsSrcRef.current?.value.length}
            className={`p-1 ${ButtonBackgroundColor()}`}>
            <Typography color="white" variant="h6">
              Tự nhập mã hàng
            </Typography>
          </Button>
          <Button
            fullWidth
            onClick={handleReadExcel}
            // disabled={!hopDongValid || !rlsSrcRef || !rlsSrcRef.current?.value.length}
            className={`p-1 ${ButtonBackgroundColor()}`}>
            <Typography color="white" variant="h6">
              nhập từ file excel
            </Typography>
          </Button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    console.log(`Export type: ${exportGC ? "GC" : "TP"}`);

    return () => {};
  }, [exportGC]);

  const BoldRadioLabel = (expected: boolean) => {
    let str_twstyles = "";
    if (expected == true) {
      str_twstyles = "text-blue-500";
    } else {
      str_twstyles = "text-green-500";
    }
    if (exportGC != expected) {
      str_twstyles = "";
    }
    return exportGC == expected ? str_twstyles + " font-bold" : str_twstyles + "";
  };

  const RadioTypes = () => {
    return (
      <div className="flex w-2/3 justify-evenly items-center shadow-md border rounded-lg mt-1 mb-2">
        <div>
          <Radio
            name="color"
            color="blue"
            label={
              <div className={`flex flex-col items-center w-max hover:scale-105`}>
                <Typography className={`text-lg uppercase ${BoldRadioLabel(true)}`}>
                  gia công
                </Typography>
                {/* <img src={svg_robot} className={`w-[48px]`} /> */}
              </div>
            }
            checked={exportGC}
            onChange={() => {
              setExportTypeRadio(!exportGC);
            }}
          />
        </div>
        <div>
          <Radio
            name="color"
            color="green"
            label={
              <div className={`flex flex-col items-center w-max hover:scale-105`}>
                <Typography className={`text-lg uppercase ${BoldRadioLabel(false)}`}>
                  thành phẩm
                </Typography>
                {/* <img src={svg_box} className={`w-[48px]`} /> */}
              </div>
            }
            checked={!exportGC}
            onChange={() => {
              setExportTypeRadio(!exportGC);
            }}
          />
        </div>
      </div>
    );
  };

  const ExportGC = () => {
    return (
      <>
        {fixedPart("xuất gia công")} {updatingPart()}
      </>
    );
  };
  const ExportTP = () => {
    return (
      <>
        {fixedPart("xuất thành phẩm")} {updatingPart()}
      </>
    );
  };

  const handleTypeProductCode = (codes: string[], amounts?: number[]) => {
    input_code.setOpen(false);
    if (amounts !== undefined && codes.length < amounts.length) {
      popup.show("Kiếm tra lại mã hàng và số lượng", "error");
      return;
    }
    setSelectedCodes(codes);
    if (amounts !== undefined) {
      setImportedAmount(amounts);
    }
  };

  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [workbook, setWorkbook] = useState<WorkBook>();
  // const handleReadExcel = async () => {
  //   const data = await FileOperation.OpenExcelAndGetSheetName();
  //   if (data.sheets.length) {
  //     setSheetNames(data.sheets);
  //     setWorkbook(data.workbook);
  //     setSheetSelectOpen(true);
  //   }
  // };

  const SelectSheetDone = async (names: string[]) => {
    setSheetSelectOpen(false);
    if (names.length == 0) return;
    Common.Log(`Selected: ${names}`);
    if (workbook !== undefined) {
      const data = await FileOperation.ReadWorkbook(
        workbook,
        names,
        "export",
        exportGC ? "processing" : "production"
      );
      setMultipleRecords(data);
    }
  };

  return (
    <>
      <NavbarDefault></NavbarDefault>
      <TypeProductCodeModal saveHandler={handleTypeProductCode}></TypeProductCodeModal>
      <ListSelect
        open={sheetSelectOpen}
        closeHandler={() => {
          setSheetSelectOpen(false);
        }}
        doneHandler={SelectSheetDone}
        label="chọn sheet cần nhập"
        label_twstyles="uppercase justify-center text-xl pt-2 border-b pb-1 mb-1"
        list_twstyles="p-0 px-1"
        list_item_twstyles="p-0 active:bg-transparent "
        item_label_twstyles="flex items-center w-full p-0 hover:cursor-pointer"
        body_twstyles="h-[35vh] overflow-x-auto overflow-y-auto p-0"
        size="sm"
        items={sheetNames}></ListSelect>
      <Card className="w-[99%] h-max">
        <CardBody className="w-full h-max overflow-hidden flex flex-col items-center p-1 border-2 border-t-0 rounded-md">
          {RadioTypes()}
          {exportGC ? ExportGC() : ExportTP()}
          <SaveButton
            multiple_record={{
              records: multipleRecords,
              // next_handler: MultipleRecordNext,
              // prev_handler: MultipleRecordPrev,
              idx_handler: MultipleRecordsIdxHandler
            }}
            className={`${SaveButtonStyle()}`}
            onClick={handleSaveClick}></SaveButton>
          {currentSessionData !== undefined ? (
            <SummaryTable
              data={currentSessionData}
              amount={importedAmount}
              input_ref={inpAmountRef}></SummaryTable>
          ) : (
            ""
          )}
        </CardBody>
      </Card>
    </>
  );
}
