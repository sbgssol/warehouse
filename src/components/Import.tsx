import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { WarehouseData } from "../types/ImportWarehouseData";
import MultipleProdCodeSelector from "./ProductSelection";
import { NavbarDefault } from "./Navbar";
import SummaryTable from "./SummaryTable";
import SaveButton from "./single/SaveButton";
import { useGlobalState } from "../types/GlobalContext";
import TypeProductCodeModal from "./single/TypeProductCodeModal";
import { Common } from "../types/GlobalFnc";
import { FileOperation } from "../types/FileOperation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Import() {
  // States
  const [hopDongStr, setHopDongStr] = useState("");
  const [billStr, setBillStr] = useState("");
  // const [realDateStr, setRealDateStr] = useState("");
  // const [docDateStr, setDocDateStr] = useState("");
  const [selectedCodes, setSelectedCodes] = useState<string[]>();
  const [importedAmount, setImportedAmount] = useState<number[]>([]);
  const { getRecordFilename } = useGlobalState();
  const { popup, product, input_code, json } = useGlobalState();

  const [dateReal, setDateReal] = useState<Date>(new Date());
  const [dateDoc, setDateDoc] = useState<Date>(new Date());

  // References
  const contractRef = useRef<HTMLInputElement>(null); // To focus when the program starts
  // const realDateRef = useRef<HTMLInputElement>(null); // To initialize to current date
  // const docDateRef = useRef<HTMLInputElement>(null); // To initialize to current date
  const inpAmountRef = useRef<HTMLInputElement[]>([]);

  const fixed_text_color = `text-amber-700`;
  const fixed_area_border = `border-amber-200`;
  const fixed_input_outline = `focus:outline-amber-300`;

  const [currentSessionData, setCurrentSessionData] = useState<WarehouseData.Record>();
  const [multipleRecords, setMultipleRecords] = useState<WarehouseData.Record[]>([]);

  // const [importFromExcel, setImportFromExcel] = useState<WarehouseData.Record[]>();

  // To load the CSV
  const [csvContent, setCsvContent] = useState<string[]>([]);

  const fetchCsvFile = async () => {
    if (json.rawMaHang !== undefined) {
      setCsvContent(json.rawMaHang);
    }
  };
  // Load CSV file once this page is mounted
  useEffect(() => {
    fetchCsvFile();
    if (contractRef.current) {
      contractRef.current.focus();
    }
    // const date = new Date();
    // const year = date.getFullYear();
    // const month = (date.getMonth() + 1).toString().padStart(2, "0");
    // const day = date.getDate().toString().padStart(2, "0");
    // if (realDateRef.current) {
    //   realDateRef.current.value = `${year}-${month}-${day}`;
    //   setRealDateStr(realDateRef.current.value);
    // }
    // if (docDateRef.current) {
    //   docDateRef.current.value = `${year}-${month}-${day}`;
    //   setDocDateStr(docDateRef.current.value);
    // }
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
    if (selectedCodes !== undefined) {
      inpAmountRef.current = [];
      const tmp = new WarehouseData.Record(
        hopDongStr,
        Common.DateToString(dateReal),
        billStr,
        Common.DateToString(dateDoc)
      );
      tmp.ClearProduct();
      selectedCodes.forEach((code) => {
        tmp.CreateProduct(code);
      });
      setCurrentSessionData(tmp);
    }

    return () => {};
  }, [selectedCodes]);

  useEffect(() => {
    if (currentSessionData !== undefined) {
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

  const handleSaveClick = async () => {
    if (currentSessionData === undefined) return;
    let res: FileOperation.SaveResult = "unknown";
    if (multipleRecords.length) {
      for (let i = 0; i < multipleRecords.length; ++i) {
        // const record = multipleRecords[i];
        res = await FileOperation.StoreRecordToDisk(
          getRecordFilename(),
          multipleRecords[i],
          "import"
        );
        if (res != "success") {
          break;
        }
      }
    } else {
      res = await FileOperation.StoreRecordToDisk(
        getRecordFilename(),
        currentSessionData,
        "import",
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
      setBillStr("");
      // setRealDateStr("");
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

  useEffect(() => {
    if (hopDongStr.length) {
      setHopDongValid(true);
    } else {
      setHopDongValid(false);
    }

    if (billStr.length) {
      setSoBillValid(true);
    } else {
      setSoBillValid(false);
    }

    return () => {};
  }, [hopDongStr, billStr]);

  const fixedPart = () => {
    return (
      <>
        <div className="flex justify-center">
          <Typography variant="h3" className={`uppercase ${fixed_text_color}`}>
            Nhập kho
          </Typography>
        </div>
        <div className={`border-2 ${fixed_area_border} rounded-lg p-2 w-full`}>
          <div className="flex items-center">
            <div className={`w-1/3 pr-2 ${fixed_text_color}`}>Hợp đồng</div>
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
              className={`w-full rounded-md p-1 pl-2 ${colorInputHopDong()}`}
              ref={contractRef}></input>
          </div>
          <div className="flex pt-2 items-center">
            <div className={`w-1/3  pr-2 ${fixed_text_color}`}>Số bill</div>
            <input
              value={billStr}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (event.target.value.length < 1) {
                  setSoBillValid(false);
                } else {
                  setSoBillValid(true);
                }
                setBillStr(event.target.value);
              }}
              className={`w-full rounded-md p-1 pl-2 ${colorInputSoBill()}`}
              // ref={billRef}
            ></input>
          </div>
          <div className="flex pt-2 items-center">
            <div className={`w-1/3  pr-2 ${fixed_text_color}`}>Ngày nhập thực tế</div>
            <div className={`w-full`}>
              <DatePicker
                className={`rounded-md p-1 pl-2 ${fixed_input_outline}`}
                selected={dateReal}
                onChange={(date) => {
                  if (date) {
                    setDateReal(date);
                  }
                }}
                dateFormat={"dd-MMM-yyyy"}
              />
            </div>
          </div>
          <div className="flex pt-2 items-center">
            <div className={`w-1/3  pr-2 ${fixed_text_color}`}>Ngày chứng từ</div>
            <div className={`w-full`}>
              <DatePicker
                className={`rounded-md p-1 pl-2 ${fixed_input_outline}`}
                selected={dateDoc}
                onChange={(date) => {
                  if (date) {
                    setDateDoc(date);
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

  // const handleSelectFromCsv = async () => {
  //   const data = await FileOperation.OpenAndReadCsvFile();
  //   if (
  //     data.every((value) => {
  //       const s = value.split(",");
  //       console.log(`size: ${s.length}, value: ${s}`);

  //       return s.every((v) => v.trim().length);
  //     })
  //   ) {
  //     let tmp: string[] = [];
  //     let amt: number[] = [];
  //     data.forEach((v) => {
  //       tmp.push(v.split(",")[0]);
  //       amt.push(Number(v.split(",")[1]));
  //     });
  //     setSelectedCodes(tmp);
  //     setImportedAmount(amt);
  //   }
  // };
  const updatingPart = () => {
    return (
      <>
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
              variant="gradient"
              color="amber"
              disabled={!hopDongValid || !soBillValid}
              className={`p-1`}>
              <Typography color="white" variant="h6">
                Chọn mã hàng
              </Typography>
            </Button>
            <Button
              fullWidth
              onClick={() => {
                input_code.show();
              }}
              variant="gradient"
              color="amber"
              disabled={!hopDongValid || !soBillValid}
              className={`p-1`}>
              <Typography color="white" variant="h6">
                Tự nhập mã hàng
              </Typography>
            </Button>
            <Button
              fullWidth
              onClick={handleReadExcel}
              variant="gradient"
              color="amber"
              // disabled={true}
              className={`p-1`}>
              <Typography color="white" variant="h6">
                nhập từ file excel
              </Typography>
            </Button>
          </div>
        </div>
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
    setMultipleRecords([]);
  };

  // const IsImport = (lines: string[], index: number) => {
  //   const res =
  //     lines[index].split(",")[0].lastIndexOf("HD") >= 0 &&
  //     lines[index + 1].split(",")[0].lastIndexOf("BILL") >= 0 &&
  //     lines[index + 2].split(",")[0].lastIndexOf("Ngày tờ khai") >= 0 &&
  //     lines[index + 3].split(",")[0].lastIndexOf("Ngày nhập thực tế") >= 0;
  //   // Common.Log(`Checking IsImport line: ${lines[index]} -> ${res}`);
  //   return res;
  // };

  // const IsExport = (lines: string[], index: number) => {
  //   const res =
  //     lines[index].split(",")[0].lastIndexOf("NƠI XUẤT") >= 0 &&
  //     lines[index + 1].split(",")[0].lastIndexOf("MÃ HÀNG") >= 0 &&
  //     lines[index + 2].split(",")[0].lastIndexOf("Ngày Xuất") >= 0;
  //   // Common.Log(`Checking IsExport line: ${lines[index]} -> ${res}`);
  //   return res;
  // };

  // function splitString(input: string): string[] {
  //   const result: string[] = [];
  //   let current = "";
  //   let insideQuotes = false;

  //   for (let i = 0; i < input.length; i++) {
  //     const char = input[i];

  //     if (char === '"') {
  //       insideQuotes = !insideQuotes;
  //     } else if (char === "," && !insideQuotes) {
  //       result.push(current.trim());
  //       current = "";
  //     } else {
  //       current += char;
  //     }
  //   }

  //   result.push(current.trim()); // Add the last part

  //   // Remove quotes from the result
  //   return result.map((str) => str.replace(/^"|"$/g, ""));
  // }

  const handleReadExcel = async () => {
    const data = await FileOperation.InputProductUsingExcel("import");
    setMultipleRecords(data);
  };

  // const MultipleRecordNext = () => {};
  // const MultipleRecordPrev = () => {};
  const MultipleRecordsIdxHandler = (idx: number) => {
    const record = multipleRecords[idx];
    setHopDongStr(record.hop_dong);
    setBillStr(record.so_bill ?? "");
    Common.Log(`record.ngay_thuc_te -> ${record.ngay_thuc_te}`);
    setDateReal(Common.DateFromString(record.ngay_thuc_te, "-"));
    if (record.ngay_chung_tu !== undefined) {
      setDateDoc(Common.DateFromString(record.ngay_chung_tu, "-"));
    }
    let amt: number[] = [];
    record.danh_sach_san_pham.forEach((re) => {
      amt.push(Number(re.sl_nhap));
    });
    setImportedAmount(amt);
    setCurrentSessionData(multipleRecords[idx]);
  };

  useEffect(() => {
    if (multipleRecords.length) {
      MultipleRecordsIdxHandler(0);
    }

    return () => {};
  }, [multipleRecords]);

  return (
    <>
      <NavbarDefault></NavbarDefault>
      <TypeProductCodeModal saveHandler={handleTypeProductCode}></TypeProductCodeModal>
      {/* <Button onClick={handleReadExcel}>Read Excel</Button> */}
      {/* <div className="w-full h-max overflow-hidden flex flex-col items-center">
        {fixedPart()}
        {updatingPart()}
        <SaveButton
          className={`text-amber-600 border-amber-600 hover:bg-amber-50`}
          onClick={handleSaveClick}></SaveButton>
        {currentSessionData !== undefined ? (
          <SummaryTable
            data={currentSessionData}
            amount={importedAmount}
            input_ref={inpAmountRef}></SummaryTable>
        ) : (
          ""
        )}
      </div> */}
      <Card className="w-[99%] h-max">
        <CardBody className="w-full h-max overflow-hidden flex flex-col items-center p-1 border-2 border-t-0 rounded-md">
          {fixedPart()}
          {updatingPart()}
          <SaveButton
            multiple_record={{
              records: multipleRecords,
              // next_handler: MultipleRecordNext,
              // prev_handler: MultipleRecordPrev,
              idx_handler: MultipleRecordsIdxHandler
            }}
            className={`text-amber-600 border-amber-600 hover:bg-amber-50`}
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
