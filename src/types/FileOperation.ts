import { dialog } from "@tauri-apps/api";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { resolveResource } from "@tauri-apps/api/path";
import { Common } from "./GlobalFnc";
import { utils, writeFileXLSX } from "xlsx";
import { ShortenData } from "./ShortenData";

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

  export const ReadCsvToArr = async (file_name: string) => {
    const data = await readTextFile(file_name);
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
            value.ngay_chung_tu ?? "-",
            value.hop_dong,
            value.ngay_thuc_te,
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
}
