import { Button, Typography } from "@material-tailwind/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { WarehouseData } from "../types/ImportWarehouseData";
import MultipleProdCodeSelector from "./ProductSelection";
import GlobalStrings from "../types/Globals";
import { NavbarDefault } from "./Navbar";
import SummaryTable from "./SummaryTable";
import SaveButton from "./single/SaveButton";
import { useGlobalState } from "../types/GlobalContext";
import TypeProductCodeModal from "./single/TypeProductCodeModal";
import { Common } from "../types/GlobalFnc";
import { dialog, fs } from "@tauri-apps/api";
import { WorkBook, WorkSheet, read, utils } from "xlsx";

export default function Import() {
  // States
  const [hopDongStr, setHopDongStr] = useState("");
  const [billStr, setBillStr] = useState("");
  const [realDateStr, setRealDateStr] = useState("");
  const [docDateStr, setDocDateStr] = useState("");
  const [selectedCodes, setSelectedCodes] = useState<string[]>();
  const [importedAmount, setImportedAmount] = useState<number[]>([]);
  const { getRecordFilename } = useGlobalState();
  const { popup, product, input_code, json } = useGlobalState();

  // References
  const contractRef = useRef<HTMLInputElement>(null); // To focus when the program starts
  const realDateRef = useRef<HTMLInputElement>(null); // To initialize to current date
  const docDateRef = useRef<HTMLInputElement>(null); // To initialize to current date
  const inpAmountRef = useRef<HTMLInputElement[]>([]);

  const fixed_text_color = `text-amber-700`;
  const fixed_area_bg = "bg-amber-100";
  const fixed_area_border = `border-amber-200`;
  const fixed_input_outline = `focus:outline-amber-300`;

  const [currentSessionData, setCurrentSessionData] = useState<WarehouseData.Record>();

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
    if (selectedCodes !== undefined) {
      inpAmountRef.current = [];
      const tmp = new WarehouseData.Record(hopDongStr, realDateStr, billStr, docDateStr);
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
    // Map amount to product
    if (inpAmountRef && currentSessionData && currentSessionData.danh_sach_san_pham.length) {
      const tmp = currentSessionData;

      if (
        inpAmountRef.current.some((value) => {
          return Number(value.value) <= 0;
        })
      ) {
        popup.show("Không thể lưu, kiểm tra lại số lượng", "error");
        return;
      }

      if (tmp.danh_sach_san_pham.length != inpAmountRef.current.length) {
        Common.Log(
          `tmp.danh_sach_san_pham.length = ${tmp.danh_sach_san_pham.length}, inpAmountRef.current.length = ${inpAmountRef.current.length}`
        );

        popup.show("Có lỗi xảy ra, hãy thử lại", "error");
        return;
      }

      for (let i = 0; i < inpAmountRef.current.length; ++i) {
        tmp.danh_sach_san_pham[i].sl_nhap = Number(inpAmountRef.current[i].value);
      }

      // dialog.message("Final data: " + ImportData.ToString(tmp));

      const res = await tmp.StoreData(getRecordFilename(), GlobalStrings.SaveDirectory, true);
      // Popup.Info("Xong", "Thông tin");
      if (res) {
        popup.show("Xong", "info");
        setHopDongStr("");
        setBillStr("");
        // setRealDateStr("");
        // setDocDateStr("");
        setSelectedCodes([]);
        setImportedAmount([]);
        setCurrentSessionData(new WarehouseData.Record("", ""));
      } else {
        popup.show("Có lỗi xảy ra, hãy thử lại", "error");
      }
      // window.location.reload();
    } else {
      popup.show("Không thể lưu, danh sách trống", "error");
    }
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
            <input
              className={`w-full bg-white rounded-md p-1 pl-2 ${fixed_input_outline}`}
              type="date"
              ref={realDateRef}
              value={realDateStr}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setRealDateStr(event.target.value);
              }}></input>
          </div>
          <div className="flex pt-2 items-center">
            <div className={`w-1/3  pr-2 ${fixed_text_color}`}>Ngày chứng từ</div>
            <input
              className={`w-full bg-white rounded-md p-1 pl-2 ${fixed_input_outline}`}
              type="date"
              ref={docDateRef}
              value={docDateStr}
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
              disabled={true}
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
  };

  const IsImport = (lines: string[], index: number) => {
    return (
      lines[index].split(",")[0].lastIndexOf("HD") >= 0 &&
      lines[index + 1].split(",")[0].lastIndexOf("BILL") >= 0 &&
      lines[index + 2].split(",")[0].lastIndexOf("Ngày tờ khai") >= 0 &&
      lines[index + 3].split(",")[0].lastIndexOf("Ngày nhập thực tế") >= 0
    );
  };

  const IsExport = (lines: string[], index: number) => {
    return (
      lines[index].split(",")[0].lastIndexOf("NƠI XUẤT") >= 0 &&
      lines[index + 1].split(",")[0].lastIndexOf("MÃ HÀNG") >= 0 &&
      lines[index + 2].split(",")[0].lastIndexOf("Ngày Xuất") >= 0
    );
  };

  const ParseDate = (str: string) => {
    // Split the string into day, month, and year components
    const [day, month, year] = str.split("/").map(Number);

    // Create a new Date object (months are zero-based in JavaScript Date)
    const dateObject = new Date(year, month - 1, day);

    // Get year, month, and day components from the date object
    const formattedYear = dateObject.getFullYear();
    const formattedMonth = String(dateObject.getMonth() + 1).padStart(2, "0"); // Adding 1 since months are zero-based
    const formattedDay = String(dateObject.getDate()).padStart(2, "0");

    // Construct the formatted date string in the "yyyy-MM-dd" format
    const formattedDate = `${formattedYear}-${formattedMonth}-${formattedDay}`;

    return formattedDate;
  };

  const handleReadExcel = async () => {
    const path = await dialog.open({
      defaultPath: await Common.BaseDiToStr(GlobalStrings.SaveDirectory),
      filters: [{ name: "Excel file", extensions: ["xlsx", "xls"] }],
      multiple: false
    });

    if (path) {
      try {
        const buffer = await fs.readBinaryFile(path as string);
        const workbook: WorkBook = read(buffer, { type: "buffer" });
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet: WorkSheet = workbook.Sheets[sheetName];
          const lines = utils.sheet_to_csv(worksheet).split(/\r?\n/);
          const lines_without_empty: string[] = [];
          lines.forEach((line) => {
            const t = line
              .trim()
              .replace(new RegExp(",", "g"), "")
              .replace(new RegExp("\r\n", "g"), "");
            if (t.length) {
              lines_without_empty.push(line.trim().replace(/\r\n/g, ""));
            }
          });

          Common.Log(`Sheet: ${sheetName}`);
          let Imported: WarehouseData.Record[] = [];
          for (let i = 0; i < lines_without_empty.length; ++i) {
            const line = lines_without_empty[i].split(",");
            if (line.length) {
              if (IsImport(lines_without_empty, i)) {
                let record: WarehouseData.Record;
                // console.log(`Hop dong: ${lines_without_empty[i].split(",")[1]}`);
                // console.log(`Bill: ${lines_without_empty[i + 1].split(",")[1]}`);
                // console.log(`Ngay to khai: ${lines_without_empty[i + 2].split(",")[1]}`);
                // console.log(`Ngay thuc te: ${lines_without_empty[i + 3].split(",")[1]}`);
                record = new WarehouseData.Record(
                  lines_without_empty[i].split(",")[1],
                  lines_without_empty[i + 3].split(",")[1],
                  lines_without_empty[i + 1].split(",")[1],
                  lines_without_empty[i + 2].split(",")[1]
                );
                for (let j = i + 4; j < lines_without_empty.length; ++j) {
                  if (IsImport(lines_without_empty, j) || IsExport(lines_without_empty, j)) {
                    i = j;
                    Imported.push(record);

                    break;
                  }
                  if (
                    lines_without_empty[j].split(",")[2].length == 0 ||
                    lines_without_empty[j].split(",")[5].length == 0
                  ) {
                    continue;
                  }
                  record.AddProduct(
                    lines_without_empty[j].split(",")[2],
                    undefined,
                    Number(lines_without_empty[j].split(",")[5])
                  );
                  console.log(
                    `  ${lines_without_empty[j].split(",")[2]} -> ${lines_without_empty[j].split(",")[5]}`
                  );
                }
              } else if (IsExport(lines_without_empty, i)) {
                let record: WarehouseData.Record;
                record = new WarehouseData.Record(
                  lines_without_empty[i + 1].split(",")[1],
                  lines_without_empty[i + 2].split(",")[1]
                );
                // console.log(`Noi xuat: ${lines_without_empty[i].split(",")[1]}`);
                // console.log(`Ma HD: ${lines_without_empty[i + 1].split(",")[1]}`);
                // console.log(`Ngay xuat: ${lines_without_empty[i + 2].split(",")[1]}`);
                for (let j = i + 3; j < lines_without_empty.length; ++j) {
                  if (IsImport(lines_without_empty, j) || IsExport(lines_without_empty, j)) {
                    i = j;
                    Imported.push(record);
                    break;
                  }
                  if (
                    lines_without_empty[j].split(",")[2].trim().length == 0 ||
                    lines_without_empty[j].split(",")[5].trim().length == 0
                  ) {
                    continue;
                  }
                  // Common.Log(
                  //   `Amount str: ${lines_without_empty[j].split(",")[5]}, converted: ${Number(lines_without_empty[j].split(",")[5])}`
                  // );
                  record.AddProduct(
                    lines_without_empty[j].split(",")[2],
                    lines_without_empty[i].split(",")[1],
                    undefined,
                    Number(lines_without_empty[j].split(",")[5])
                  );
                  // console.log(
                  //   `  ${lines_without_empty[j].split(",")[2]} -> ${lines_without_empty[j].split(",")[5]}`
                  // );
                }
              }
            }
          }
          if (Imported.length) {
            // Imported.forEach((record) => {
            //   console.log(`Imported:\n${JSON.stringify(record)}`);
            // });
            const first = Imported[0];
            setHopDongStr(first.hop_dong);
            if (first.so_bill) {
              setBillStr(first.so_bill);
            }
            setRealDateStr(ParseDate(first.ngay_thuc_te));
            if (first.ngay_chung_tu) {
              setDocDateStr(ParseDate(first.ngay_chung_tu));
            }
            setCurrentSessionData(Imported[0]);
            let amt: number[] = [];
            first.danh_sach_san_pham.forEach((re) => {
              amt.push(Number(re.sl_nhap));
            });
            setImportedAmount(amt);
          }
        });
      } catch (error) {
        Common.Log(`Error reading Excel file: ${error}`);
      }
    } else {
      Common.Log("File selection cancelled");
    }
  };

  return (
    <>
      <NavbarDefault></NavbarDefault>
      <TypeProductCodeModal saveHandler={handleTypeProductCode}></TypeProductCodeModal>
      {/* <Button onClick={handleReadExcel}>Read Excel</Button> */}
      <div className="w-full h-max overflow-hidden flex flex-col items-center">
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
      </div>
    </>
  );
}
