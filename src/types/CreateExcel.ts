import { writeTextFile } from "@tauri-apps/api/fs";
import { ShortenData } from "./ShortenData";
import GlobalStrings from "./Globals";

export namespace CreateExcel {
  function formatDate(date: Date): string {
    const year = date.getFullYear();
    let month: string | number = date.getMonth() + 1; // Month is zero-based
    let day: string | number = date.getDate();
    let hour: string | number = date.getHours();
    let minute: string | number = date.getMinutes();
    let second: string | number = date.getSeconds();

    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    if (second < 10) {
      second = "0" + second;
    }

    // return `${year}${month}${day}${hour}${minute}${second}`;
    return `${year}${month}${day}`;
  }

  export const BaoCaoQuyetToan = async (
    records: Map<string, ShortenData[]>,
    product_map: Map<string, { name: string; unit: string }>
  ) => {
    const formattedDate = formatDate(new Date());
    let text = "";
    records.forEach((_data, code) => {
      text += `${code},${product_map.get(code)?.name}`;
    });
    await writeTextFile(formattedDate + "-" + GlobalStrings.NameBaoCaoQuyetToan, text, {
      dir: GlobalStrings.SaveDirectory,
      append: false
    });
  };
}
