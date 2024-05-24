import { dialog, fs } from "@tauri-apps/api";
import {
  BaseDirectory,
  copyFile,
  createDir,
  exists,
  readTextFile,
  removeDir,
  writeTextFile
} from "@tauri-apps/api/fs";
import { resolveResource } from "@tauri-apps/api/path";
import { Common } from "./GlobalFnc";
import { WorkBook, WorkSheet, read, utils, writeFileXLSX } from "xlsx";
import { ShortenData } from "./ShortenData";
import GlobalStrings from "./Globals";
import { WarehouseData } from "./ImportWarehouseData";
import { MutableRefObject } from "react";

export namespace FileOperation {
  export const WriteCsv = async (
    file_name: string,
    location: BaseDirectory,
    data: string[],
    append?: boolean
  ) => {
    if (data.length == 0) return;
    // format data to have multiple lines
    let str = "";
    data.forEach((v) => {
      v = v.trim();
      if (v.length) {
        str += v.trim() + "\n";
      }
    });
    str = str.slice(0, str.length - 1);
    const rc = await writeTextFile(file_name, str, { dir: location, append: append });
    setTimeout(() => {
      console.log(`[FileOperation] -> WriteCsv -> (${rc})`);
    }, 200);
  };

  export const WriteRawFile = async (name: string, data: string, override?: boolean) => {
    await writeTextFile(name, data, {
      dir: GlobalStrings.SaveDirectory,
      append: override
    });
  };

  // Only used for embedded resource files
  export const ReadResourceCsvToArr = async (file_name: string) => {
    const resourcePath = await resolveResource(file_name);

    const data = await readTextFile(resourcePath);
    let res = [];

    if (data.indexOf("\r\n") >= 0) {
      res = data.split("\r\n");
    } else {
      res = data.split("\n");
    }

    console.log(
      `[FileOperation] -> ReadResourceCsvToArr(${file_name}) -> Lines: ${res.length} \n${res}`
    );
    console.log(`\n<-`);

    return res;
  };

  // Use for any file in the allow scopes
  export const ReadCsvToArr = async (file_name: string, dir?: BaseDirectory) => {
    const data = await readTextFile(file_name, { dir: dir ?? GlobalStrings.SaveDirectory });
    let res = [];

    if (data.indexOf("\r\n") >= 0) {
      res = data.split("\r\n");
    } else {
      res = data.split("\n");
    }

    console.log(
      `[FileOperation] -> ReadResourceCsvToArr(${file_name}) -> Lines: ${res.length} \n${res}`
    );
    console.log(`\n<-`);

    if (res[res.length - 1].length == 0) {
      res = res.slice(0, res.length - 1);
    }

    return res;
  };

  // Use for any file in the allow scopes
  export const OpenAndReadCsvFile = async () => {
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
    return data;
  };

  // Use for any file in the allow scopes
  export const OpenAndReadFile = async (extension: string) => {
    const selected = await dialog.open({
      defaultPath: await Common.BaseDiToStr(BaseDirectory.Resource),
      filters: [{ name: extension.toUpperCase(), extensions: [extension] }],
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
    return data;
  };

  export const CheckExist = async (name: string, setter: (exist: boolean) => void) => {
    setter(await exists(name, { dir: GlobalStrings.SaveDirectory }));
  };

  export const ReadRawFile = async (name: string) => {
    return await readTextFile(name, { dir: GlobalStrings.SaveDirectory });
  };

  export namespace Report {
    export type TheKhoType = {
      ma_hang: string;
      ten_hang: string;
      dvt: string;
      data_by_date: ShortenData[];
    };
    type CongCuoiKi = {
      nhap: number;
      xuat_gc: number;
      xuat_tp: number;
      ton_tp: number;
      ton_tt: number;
    };

    export type BCQT_ChiTiet = {
      ma_hang: string;
      ten_hang: string;
      dvt: string;
      ton_dau_ki: number;
      nhap_trong_ki: number;
      tai_xuat: number;
      tieu_huy: number;
      xuat_san_xuat: number;
      xuat_kho_khac: number;
      ton_cuoi_ki: number;
    };

    export type BCQT = {
      so_hop_dong: string;
      ngay_bat_dau: string;
      ngay_het_han: string;
      chi_tiet: BCQT_ChiTiet[];
    };

    export const RecordsToBCQt = (
      records: WarehouseData.Record[],
      product_map: Map<string, { name: string; unit: string }>,
      so_hop_dong: string,
      ngay_bat_dau: string,
      ngay_het_han: string
    ) => {
      let tmp: BCQT = {
        so_hop_dong: so_hop_dong,
        ngay_bat_dau: ngay_bat_dau,
        ngay_het_han: ngay_het_han,
        chi_tiet: []
      } as BCQT;

      records.forEach((record) => {
        record.danh_sach_san_pham.forEach((prod) => {
          tmp.chi_tiet.push({
            ma_hang: prod.ma_hang,
            ten_hang: product_map.get(prod.ma_hang)?.name,
            dvt: product_map.get(prod.ma_hang)?.unit,
            ton_dau_ki: -1,
            nhap_trong_ki: -1,
            tai_xuat: -1,
            tieu_huy: -1,
            xuat_san_xuat: -1,
            xuat_kho_khac: -1,
            ton_cuoi_ki: -1
          } as BCQT_ChiTiet);
        });
      });
      return tmp;
    };

    const BaoCaoQuyetToanToAoa = (data: BCQT) => {
      let tmp: string[][] = [];
      tmp.push([
        "Tên tổ chức cá nhân: CÔNG TY TRÁCH NHIỆM HỮU HẠN UNIMAX SAIGON",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Mẫu số 15/BCQT-NVL/GSQL"
      ]);
      tmp.push([
        "Địa chỉ: Khu A, Lô M, số 08a-10-12, đường số 12, khu chế xuất Tân Thu - Phường Tân Thuận Đông - Quận 7 - TP H",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM"
      ]);
      tmp.push([
        "Mã số thuế: 0300792483",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Độc lập - Tự do - Hạnh phúc"
      ]);
      tmp.push([""]);
      tmp.push([
        "BÁO CÁO QUYẾT TOÁN NHẬP-XUẤT-TỒN KHO NGUYÊN LIỆU, VẬT TƯ NHẬP KHẨU LOẠI HÌNH GIA CÔNG"
      ]);
      tmp.push(["Kỳ báo cáo: Từ ngày 06/12/2023 Đến ngày 30/04/2024"]);
      tmp.push([
        "STT",
        "Mã nguyên liệu, vật tư",
        "Tên nguyên liệu, vật tư",
        "Đơn vị tính",
        "",
        "Lượng NL, VT tồn kho đầu kỳ",
        "Lượng NL, VT nhập trong kỳ",
        "Tái xuất",
        "Chuyển mục đích sử dụng, tiêu thụ nội địa, tiêu hủy",
        "Xuất kho để sản xuất",
        "Xuất kho khác",
        "Lượng NL, VT nhập khẩu tồn kho cuối kỳ",
        "Ghi chú"
      ]);
      tmp.push([
        "Số hợp đồng",
        data.so_hop_dong,
        "Ngày bắt đầu",
        data.ngay_bat_dau,
        "Ngày hết hạn",
        data.ngay_het_han
      ]);
      data.chi_tiet.forEach((value, idx) => {
        tmp.push([
          String(idx + 1),
          value.ma_hang,
          value.ten_hang,
          value.dvt,
          `${value.ma_hang},${value.ten_hang},${value.dvt}`,
          String(value.ton_dau_ki),
          String(value.nhap_trong_ki),
          String(value.tai_xuat),
          String(value.tieu_huy),
          String(value.xuat_san_xuat),
          String(value.xuat_kho_khac),
          String(value.ton_cuoi_ki),
          ""
        ]);
      });

      return tmp;
    };

    export const CreateBaoCaoQuyetToan = (data: BCQT) => {
      const wb = utils.book_new();
      let ws = utils.aoa_to_sheet(BaoCaoQuyetToanToAoa(data));
      utils.book_append_sheet(wb, ws, "Data");
      writeFileXLSX(wb, "BCQT_" + data.so_hop_dong + "_" + GetTimestamp() + ".xlsx");
    };

    const ConvertTheKhoToAoA = (data: TheKhoType[], sum: Map<string, CongCuoiKi>) => {
      let tmp: string[][] = [];
      data.forEach((value) => {
        tmp.push(["Mã hàng:", value.ma_hang]);
        tmp.push(["Tên hàng:", value.ten_hang]);
        tmp.push(["ĐVT:", value.dvt]);
        tmp.push([
          "STT",
          "Nơi xuất",
          "Số bill",
          "Ngày chứng từ",
          "Mã HĐ",
          "Ngày thực tế",
          "SL Nhập",
          "SL xuất GC",
          "SL xuất TP",
          "SL tồn TP",
          "SL tồn TT"
        ]);
        value.data_by_date.forEach((value, idx) => {
          tmp.push([
            String(idx + 1),
            value.noi_xuat ?? "-",
            value.so_bill ?? "-",
            value.ngay_chung_tu !== undefined
              ? Common.ParseDateReport(value.ngay_chung_tu, "-")
              : "-",
            value.hop_dong,
            Common.ParseDateReport(value.ngay_thuc_te, "-"),
            String(value.sl_nhap ?? "-"),
            String(value.sl_xuat_gc ?? "-"),
            String(value.sl_xuat_tp ?? "-"),
            String(value.sl_ton_tp ?? "-"),
            String(value.sl_ton_tt ?? "-")
          ]);
        });
        const t = sum.get(value.ma_hang);
        if (t) {
          tmp.push([
            "",
            "",
            "",
            "",
            "",
            "Cộng cuối kì",
            String(t.nhap),
            String(t.xuat_gc),
            String(t.xuat_tp),
            String(t.ton_tp),
            String(t.ton_tt)
          ]);
        }
        tmp.push([]);
        tmp.push([]);
      });
      return tmp;
    };
    const GetTimestamp = () => {
      const date = new Date(Date.now());
      const y = String(date.getFullYear()).slice(2);
      const m = String(date.getMonth()).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      const h = String(date.getHours()).padStart(2, "0");
      const M = String(date.getMinutes()).padStart(2, "0");
      const s = String(date.getSeconds()).padStart(2, "0");
      return `${h}${M}${s}${d}${m}${y}`;
    };
    export const CreateTheKho = (data: TheKhoType[], sum: Map<string, CongCuoiKi>) => {
      const wb = utils.book_new();

      let ws = utils.aoa_to_sheet(ConvertTheKhoToAoA(data, sum));
      utils.book_append_sheet(wb, ws, "Data");
      writeFileXLSX(wb, "TheKho_" + GetTimestamp() + ".xlsx");
    };
  }

  export namespace Check {
    export const Exist = async (path: string) => {
      const res = await exists(path, { dir: GlobalStrings.SaveDirectory });
      // if (res) {
      //   const data = await readDir(path, { dir: GlobalStrings.SaveDirectory });
      //   console.log(`${path} -> Exists\n${JSON.stringify(data)}`);
      // }
      return res;
    };
  }

  export type DirType = "resources" | "data";
  export namespace Dir {
    export const Create = async (name: string, type: DirType) => {
      console.log(`[FileOperation] -> Creating ${type}\\${name}`);
      await createDir(type + "\\" + name, { dir: GlobalStrings.SaveDirectory, recursive: true });
    };
    export const Remove = async (name: string, location: DirType) => {
      console.log(`[FileOperation] -> Removing ${location}\\${name}`);
      await removeDir(`${location}\\${name}`, {
        dir: GlobalStrings.SaveDirectory,
        recursive: true
      });
    };
  }

  export namespace Read {
    export const RawData = async (file_name: string, location: DirType) => {
      return await readTextFile(`${location}\\${file_name}`, { dir: GlobalStrings.SaveDirectory });
    };

    export const RawDataWithDelimiter = async (
      file_name: string,
      location: DirType,
      delimiter: string[]
    ) => {
      const data = await readTextFile(`${location}\\${file_name}`, {
        dir: GlobalStrings.SaveDirectory
      });
      let res: string[] = [];
      for (let i = 0; i < delimiter.length; ++i) {
        if (data.lastIndexOf(delimiter[i]) >= 0) {
          res = data.split(delimiter[i]);
          break;
        }
      }

      let t: string[] = [];
      res.forEach((str) => {
        if (str.trim().length) {
          t.push(str);
        }
      });
      return t;
    };
  }

  export namespace Write {
    export const RawData = async (
      file_name: string,
      location: DirType,
      data: string,
      override?: boolean
    ) => {
      await writeTextFile(`${location}\\${file_name}`, data, {
        dir: GlobalStrings.SaveDirectory,
        append: override
      });
    };
  }

  export const Copy = async (source: string, destination: string) => {
    await copyFile(source, destination, { dir: GlobalStrings.SaveDirectory });
  };

  function splitString(input: string): string[] {
    const result: string[] = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim()); // Add the last part

    // Remove quotes from the result
    return result.map((str) => str.replace(/^"|"$/g, ""));
  }

  const IsImport = (lines: string[], index: number) => {
    const res =
      lines[index].split(",")[0].lastIndexOf("HD") >= 0 &&
      lines[index + 1].split(",")[0].lastIndexOf("BILL") >= 0 &&
      lines[index + 2].split(",")[0].lastIndexOf("Ngày tờ khai") >= 0 &&
      lines[index + 3].split(",")[0].lastIndexOf("Ngày nhập thực tế") >= 0;
    // Common.Log(`Checking IsImport line: ${lines[index]} -> ${res}`);
    return res;
  };

  const IsExport = (lines: string[], index: number) => {
    const res =
      lines[index].split(",")[0].lastIndexOf("NƠI XUẤT") >= 0 &&
      lines[index + 1].split(",")[0].lastIndexOf("MÃ HÀNG") >= 0 &&
      lines[index + 2].split(",")[0].lastIndexOf("Ngày Xuất") >= 0;
    // Common.Log(`Checking IsExport line: ${lines[index]} -> ${res}`);
    return res;
  };

  type InputType = "import" | "export";
  type ExportType = "production" | "processing";
  const IsTargetSheet = (sheet_name: string, type: InputType) => {
    if (type == "import") {
      return (
        sheet_name.includes("nhập") || sheet_name.includes("Nhập") || sheet_name.includes("NHẬP")
      );
    } else if (type == "export") {
      // Common.Log(
      //   `Checking target sheet with type: ${type}, sheet_name.includes("xuất") = ${sheet_name.includes("xuất")}, sheet_name.includes("Xuất") = ${sheet_name.includes("Xuất")}, sheet_name.includes("XUẤT") = ${sheet_name.includes("XUẤT")}`
      // );
      return (
        sheet_name.includes("xuất") || sheet_name.includes("Xuất") || sheet_name.includes("XUẤT")
      );
    }
    return false;
  };

  export const InputProductUsingExcel = async (
    type: InputType,
    export_type?: ExportType
  ): Promise<WarehouseData.Record[]> => {
    const path = await dialog.open({
      defaultPath: await Common.BaseDiToStr(GlobalStrings.SaveDirectory),
      filters: [{ name: "Excel file", extensions: ["xlsx", "xls"] }],
      multiple: false
    });
    let result: WarehouseData.Record[] = [];
    if (path) {
      try {
        const buffer = await fs.readBinaryFile(path as string);
        const workbook: WorkBook = read(buffer, { type: "buffer" });
        let Imported: WarehouseData.Record[] = [];
        workbook.SheetNames.forEach((sheetName) => {
          if (IsTargetSheet(sheetName, type)) {
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

            // lines_without_empty.forEach((line) => {
            //   Common.Log(`line: ${line}`);
            // });

            // Common.Log(`Sheet: ${sheetName}`);

            for (let i = 0; i < lines_without_empty.length; ++i) {
              const line = splitString(lines_without_empty[i]);
              if (line.length) {
                if (IsImport(lines_without_empty, i)) {
                  let record: WarehouseData.Record;
                  const hop_dong = splitString(lines_without_empty[i])[1];
                  const so_bill = splitString(lines_without_empty[i + 1])[1];
                  const ngay_chung_tu = Common.ParseDate(
                    splitString(lines_without_empty[i + 2])[1]
                  );
                  const ngay_thuc_te = Common.ParseDate(splitString(lines_without_empty[i + 3])[1]);
                  record = new WarehouseData.Record(hop_dong, ngay_thuc_te, so_bill, ngay_chung_tu);

                  for (let j = i + 4; j < lines_without_empty.length; ++j) {
                    if (IsImport(lines_without_empty, j) || IsExport(lines_without_empty, j)) {
                      i = j - 1;
                      break;
                    }
                    if (
                      splitString(lines_without_empty[j])[2].length == 0 ||
                      splitString(lines_without_empty[j])[5].length == 0
                    ) {
                      continue;
                    }
                    record.AddProduct(
                      splitString(lines_without_empty[j])[2],
                      undefined,
                      Number(splitString(lines_without_empty[j])[5])
                    );
                    // console.log(
                    //   `  ${lines_without_empty[j].split(",")[2]} -> ${lines_without_empty[j].split(",")[5]}`
                    // );
                  }
                  Imported.push(record);
                } else if (IsExport(lines_without_empty, i)) {
                  let record: WarehouseData.Record;
                  const hop_dong = splitString(lines_without_empty[i + 1])[1];
                  const ngay_thuc_te = Common.ParseDate(splitString(lines_without_empty[i + 2])[1]);
                  Common.Log(`Initializing ${hop_dong}, ${ngay_thuc_te}`);
                  record = new WarehouseData.Record(hop_dong, ngay_thuc_te);

                  for (let j = i + 3; j < lines_without_empty.length; ++j) {
                    if (IsImport(lines_without_empty, j) || IsExport(lines_without_empty, j)) {
                      i = j - 1;
                      break;
                    }
                    if (
                      splitString(lines_without_empty[j])[2].trim().length == 0 ||
                      splitString(lines_without_empty[j])[5].trim().length == 0
                    ) {
                      continue;
                    }
                    // Common.Log(
                    //   `Amount str: ${lines_without_empty[j].split(",")[5]}, converted: ${Number(lines_without_empty[j].split(",")[5])}`
                    // );
                    if (export_type !== undefined) {
                      if (export_type == "processing") {
                        const ma_hang = splitString(lines_without_empty[j])[2];
                        const noi_xuat = splitString(lines_without_empty[i])[1];
                        const sl_nhap = undefined;
                        const sl_xuat_gc = Number(splitString(lines_without_empty[j])[5]);
                        const sl_xuat_tp = undefined;
                        Common.Log(
                          `Adding processing: ${ma_hang}, ${noi_xuat}, ${sl_nhap}, ${sl_xuat_gc}, ${sl_xuat_tp}`
                        );
                        record.AddProduct(ma_hang, noi_xuat, sl_nhap, sl_xuat_gc, sl_xuat_tp);
                      } else if (export_type == "production") {
                        const ma_hang = splitString(lines_without_empty[j])[2];
                        const noi_xuat = splitString(lines_without_empty[i])[1];
                        const sl_nhap = undefined;
                        const sl_xuat_gc = undefined;
                        const sl_xuat_tp = Number(splitString(lines_without_empty[j])[5]);
                        Common.Log(
                          `Adding processing: ${ma_hang}, ${noi_xuat}, ${sl_nhap}, ${sl_xuat_gc}, ${sl_xuat_tp}`
                        );
                        record.AddProduct(ma_hang, noi_xuat, sl_nhap, sl_xuat_gc, sl_xuat_tp);
                      }
                    }
                    // console.log(
                    //   `  ${lines_without_empty[j].split(",")[2]} -> ${lines_without_empty[j].split(",")[5]}`
                    // );
                  }
                  if (record.danh_sach_san_pham.length != 0) {
                    Imported.push(record);
                  }
                }
              }
            }
            Common.Log(`In sheet ${sheetName} there are ${Imported.length} records`);
          }
        });

        result = Imported;
      } catch (error) {
        Common.Log(`Error reading Excel file: ${error}`);
      }
    } else {
      Common.Log("File selection cancelled");
    }
    return result;
  };

  export const ReadWorkbook = async (
    workbook: WorkBook,
    sheets: string[],
    type: InputType,
    export_type?: ExportType
  ): Promise<WarehouseData.Record[]> => {
    let result: WarehouseData.Record[] = [];
    try {
      let Imported: WarehouseData.Record[] = [];
      const sheetnames = new Set(sheets);
      // Common.Log(`sheetnames.size: ${sheetnames.size}`);
      workbook.SheetNames.forEach((sheetName) => {
        // Common.Log(`sheetnames.has(${sheetName}) -> ${sheetnames.has(sheetName)}`);
        if (IsTargetSheet(sheetName, type) && sheetnames.has(sheetName)) {
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

          // lines_without_empty.forEach((line) => {
          //   Common.Log(`line: ${line}`);
          // });

          // Common.Log(`Sheet: ${sheetName}`);

          for (let i = 0; i < lines_without_empty.length; ++i) {
            const line = splitString(lines_without_empty[i]);
            if (line.length) {
              if (IsImport(lines_without_empty, i)) {
                let record: WarehouseData.Record;
                const hop_dong = splitString(lines_without_empty[i])[1];
                const so_bill = splitString(lines_without_empty[i + 1])[1];
                const ngay_chung_tu = Common.ParseDate(splitString(lines_without_empty[i + 2])[1]);
                const ngay_thuc_te = Common.ParseDate(splitString(lines_without_empty[i + 3])[1]);
                record = new WarehouseData.Record(hop_dong, ngay_thuc_te, so_bill, ngay_chung_tu);

                for (let j = i + 4; j < lines_without_empty.length; ++j) {
                  if (IsImport(lines_without_empty, j) || IsExport(lines_without_empty, j)) {
                    i = j - 1;
                    break;
                  }
                  if (
                    splitString(lines_without_empty[j])[2].length == 0 ||
                    splitString(lines_without_empty[j])[5].length == 0
                  ) {
                    continue;
                  }
                  record.AddProduct(
                    splitString(lines_without_empty[j])[2],
                    undefined,
                    Number(splitString(lines_without_empty[j])[5])
                  );
                  // console.log(
                  //   `  ${lines_without_empty[j].split(",")[2]} -> ${lines_without_empty[j].split(",")[5]}`
                  // );
                }
                Imported.push(record);
              } else if (IsExport(lines_without_empty, i)) {
                let record: WarehouseData.Record;
                const hop_dong = splitString(lines_without_empty[i + 1])[1];
                const ngay_thuc_te = Common.ParseDate(splitString(lines_without_empty[i + 2])[1]);
                Common.Log(`Initializing ${hop_dong}, ${ngay_thuc_te}`);
                record = new WarehouseData.Record(hop_dong, ngay_thuc_te);

                for (let j = i + 3; j < lines_without_empty.length; ++j) {
                  if (IsImport(lines_without_empty, j) || IsExport(lines_without_empty, j)) {
                    i = j - 1;
                    break;
                  }
                  if (
                    splitString(lines_without_empty[j])[2].trim().length == 0 ||
                    splitString(lines_without_empty[j])[5].trim().length == 0
                  ) {
                    continue;
                  }
                  // Common.Log(
                  //   `Amount str: ${lines_without_empty[j].split(",")[5]}, converted: ${Number(lines_without_empty[j].split(",")[5])}`
                  // );
                  if (export_type !== undefined) {
                    if (export_type == "processing") {
                      const ma_hang = splitString(lines_without_empty[j])[2];
                      const noi_xuat = splitString(lines_without_empty[i])[1];
                      const sl_nhap = undefined;
                      const sl_xuat_gc = Number(splitString(lines_without_empty[j])[5]);
                      const sl_xuat_tp = undefined;
                      Common.Log(
                        `Adding processing: ${ma_hang}, ${noi_xuat}, ${sl_nhap}, ${sl_xuat_gc}, ${sl_xuat_tp}`
                      );
                      record.AddProduct(ma_hang, noi_xuat, sl_nhap, sl_xuat_gc, sl_xuat_tp);
                    } else if (export_type == "production") {
                      const ma_hang = splitString(lines_without_empty[j])[2];
                      const noi_xuat = splitString(lines_without_empty[i])[1];
                      const sl_nhap = undefined;
                      const sl_xuat_gc = undefined;
                      const sl_xuat_tp = Number(splitString(lines_without_empty[j])[5]);
                      Common.Log(
                        `Adding processing: ${ma_hang}, ${noi_xuat}, ${sl_nhap}, ${sl_xuat_gc}, ${sl_xuat_tp}`
                      );
                      record.AddProduct(ma_hang, noi_xuat, sl_nhap, sl_xuat_gc, sl_xuat_tp);
                    }
                  }
                  // console.log(
                  //   `  ${lines_without_empty[j].split(",")[2]} -> ${lines_without_empty[j].split(",")[5]}`
                  // );
                }
                if (record.danh_sach_san_pham.length != 0) {
                  Imported.push(record);
                }
              }
            }
          }
          Common.Log(`In sheet ${sheetName} there are ${Imported.length} records`);
        }
      });

      result = Imported;
    } catch (error) {
      Common.Log(`Error reading Excel file: ${error}`);
    }
    return result;
  };

  export const OpenExcelAndGetSheetName = async () => {
    const path = await dialog.open({
      defaultPath: await Common.BaseDiToStr(GlobalStrings.SaveDirectory),
      filters: [{ name: "Excel file", extensions: ["xlsx", "xls"] }],
      multiple: false
    });
    type Result = {
      sheets: string[];
      workbook?: WorkBook;
    };
    let result = { sheets: [] } as Result;
    if (path) {
      try {
        const buffer = await fs.readBinaryFile(path as string);
        const workbook: WorkBook = read(buffer, { type: "buffer" });
        workbook.SheetNames.forEach((sheetName) => {
          result.sheets.push(sheetName);
        });

        result.workbook = workbook;
      } catch (error) {
        Common.Log(`Error reading Excel file: ${error}`);
      }
    } else {
      Common.Log("File selection cancelled");
    }
    return result;
  };

  export type SaveResult = "success" | "amount_error" | "unknown";
  export type StoreType = "import" | "export-processing" | "export-production";

  export const StoreRecordToDisk = async (
    file_name: string,
    record: WarehouseData.Record,
    type: StoreType,
    inputRef?: MutableRefObject<HTMLInputElement[]>
  ): Promise<SaveResult> => {
    let amount: number[] = [];
    if (inputRef !== undefined) {
      if (
        inputRef.current.length == 0 ||
        inputRef.current.length != record.danh_sach_san_pham.length ||
        inputRef.current.some((value) => {
          Common.Log(
            `value -> ${value}\nNumber(value) <= 0 -> ${Number(value.value) <= 0}\nisNaN(Number(value)-> ${isNaN(Number(value.value))}`
          );
          return Number(value.value) <= 0 || isNaN(Number(value.value));
        })
      ) {
        Common.Log(
          `inputRef.current.length == 0 -> ${inputRef.current.length == 0}\n\
          inputRef.current.length != record.danh_sach_san_pham.length -> ${inputRef.current.length != record.danh_sach_san_pham.length}\
          inputRef.current.some((value) => Number(value) <= 0 || isNaN(Number(value)) -> ${inputRef.current.some((value) => Number(value) <= 0 || isNaN(Number(value)))}`
        );
        return "amount_error";
      }
      inputRef.current.forEach((value) => {
        amount.push(Number(value.value));
      });
    }

    const tmp = record;

    if (amount.length) {
      for (let i = 0; i < amount.length; ++i) {
        if (type == "import") {
          tmp.danh_sach_san_pham[i].sl_nhap = Number(amount[i]);
        } else if (type == "export-processing") {
          tmp.danh_sach_san_pham[i].sl_xuat_gc = Number(amount[i]);
        } else if (type == "export-production") {
          tmp.danh_sach_san_pham[i].sl_xuat_tp = Number(amount[i]);
        } else {
          return "unknown";
        }
      }
    }

    const res = await tmp.StoreData(file_name, GlobalStrings.SaveDirectory, true);
    if (res) {
      return "success";
    } else {
      return "unknown";
    }

    // const old = await WarehouseData.RestoreData(file_name, GlobalStrings.SaveDirectory);
    // old.push(tmp);

    // const sorted = Common.SortRecords(old);
    // let res = false;
    // for (let i = 0; i < sorted.length; ++i) {
    //   res = await sorted[i].StoreData(file_name, GlobalStrings.SaveDirectory, true);
    //   if (res == false) {
    //     return "unknown";
    //   }
    // }
    return "success";

    // const res = await tmp.StoreData(file_name, GlobalStrings.SaveDirectory, true);
    // if (res) {
    //   return "success";
    // } else {
    //   return "unknown";
    // }
  };
}
