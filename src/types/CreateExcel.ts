import { ShortenData } from "./ShortenData";
import { utils, writeFileXLSX } from "xlsx";

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
    hop_dong: string,
    records: Map<string, ShortenData[]>,
    product_map: Map<string, { name: string; unit: string }>
  ) => {
    /* generate worksheet from state */

    const formattedDate = formatDate(new Date());
    let arr: {
      STT: number;
      "Mã hàng": string;
      "Tên hàng": string;
      ĐVT: string;
      "Tồn đầu kì": number;
    }[] = [];
    let stt = 0;

    const TonDauKi = (data: ShortenData[]) => {
      let num = 0;
      data.forEach((value) => {
        num += Number(Number(value.sl_nhap ?? 0).toFixed(4));
      });
      return num;
    };

    records.forEach((data, code) => {
      arr.push({
        STT: ++stt,
        "Mã hàng": code,
        "Tên hàng": product_map.get(code)?.name ?? "",
        ĐVT: product_map.get(code)?.unit ?? "",
        "Tồn đầu kì": TonDauKi(data)
      });
      console.log(arr);
    });
    const wb = utils.book_new();
    const ws = utils.json_to_sheet(arr);
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, "BCQT_" + hop_dong + "_" + formattedDate + ".xlsx");
  };
}
