import { path } from "@tauri-apps/api";
import { BaseDirectory } from "@tauri-apps/api/fs";
import { WarehouseData } from "./ImportWarehouseData";

export namespace Common {
  export const BaseDiToStr = async (dir: BaseDirectory) => {
    let res = "NOT SUPPORTED";
    switch (dir) {
      case BaseDirectory.Audio: {
        res = await path.audioDir();
        break;
      }
      case BaseDirectory.Cache: {
        res = await path.cacheDir();
        break;
      }
      case BaseDirectory.Config: {
        res = await path.configDir();
        break;
      }
      case BaseDirectory.Data: {
        res = await path.dataDir();
        break;
      }
      case BaseDirectory.LocalData: {
        res = await path.localDataDir();
        break;
      }
      case BaseDirectory.Desktop: {
        res = await path.desktopDir();
        break;
      }
      case BaseDirectory.Document: {
        res = await path.documentDir();
        break;
      }
      case BaseDirectory.Download: {
        res = await path.downloadDir();
        break;
      }
      case BaseDirectory.Executable: {
        break;
      }
      case BaseDirectory.Font: {
        break;
      }
      case BaseDirectory.Home: {
        res = await path.homeDir();
        break;
      }
      case BaseDirectory.Picture: {
        res = await path.pictureDir();
        break;
      }
      case BaseDirectory.Public: {
        res = await path.publicDir();
        break;
      }
      case BaseDirectory.Runtime: {
        break;
      }
      case BaseDirectory.Template: {
        res = await path.templateDir();
        break;
      }
      case BaseDirectory.Video: {
        res = await path.videoDir();
        break;
      }
      case BaseDirectory.Resource: {
        res = await path.resourceDir();
        break;
      }
      case BaseDirectory.App: {
        break;
      }
      case BaseDirectory.Log: {
        res = await path.appLogDir();
        break;
      }
      case BaseDirectory.Temp: {
        res = await path.templateDir();
        break;
      }
      case BaseDirectory.AppConfig: {
        res = await path.appConfigDir();
        break;
      }
      case BaseDirectory.AppData: {
        res = await path.appDataDir();
        break;
      }
      case BaseDirectory.AppLocalData: {
        res = await path.appLocalDataDir();
        break;
      }
      case BaseDirectory.AppCache: {
        res = await path.appCacheDir();
        break;
      }
      default: {
        res = "NOT SUPPORTED";
      }
    }
    return res;
  };
  type log_type = "info" | "warn" | "error";
  export const Log = async (msg: string, log_type: log_type = "info") => {
    const log = `[${log_type.toUpperCase()}] [${new Date(Date.now()).toString().slice(4, 24)}] | ${msg}\n`;
    console.log(log);
    // try {
    //   await writeTextFile(
    //     `E:\\Projects\\18.React\\warehouse\\src-tauri\\target\\debug\\log.txt`,
    //     log,
    //     { append: true }
    //   );
    // } catch (error) {
    //   // Dialog.Error(error as string);
    //   return;
    // }
  };

  // Convert dd/MM/yy or dd-MM-yy to dd-MM-yyy
  export const ParseDate = (str: string, delim?: string) => {
    if (str.length == 0) return str;
    const d = delim !== undefined ? delim : "/";
    // Split the string into day, month, and year components
    let [day, month, year] = str.split(d).map(Number);
    if (String(year).length == 2) {
      year = 2024;
    }
    // Create a new Date object (months are zero-based in JavaScript Date)
    const dateObject = new Date(year, month - 1, day);

    // Get year, month, and day components from the date object
    const formattedYear = dateObject.getFullYear();
    const formattedMonth = String(dateObject.getMonth() + 1).padStart(2, "0"); // Adding 1 since months are zero-based
    const formattedDay = String(dateObject.getDate()).padStart(2, "0");

    // Construct the formatted date string in the "yyyy-MM-dd" format
    const formattedDate = `${formattedDay}-${formattedMonth}-${formattedYear}`;

    return formattedDate;
  };

  export const ParseDateReport = (str: string, delim?: string) => {
    const d = delim !== undefined ? delim : "/";
    // Split the string into day, month, and year components
    let [day, month, year] = str.split(d).map(Number);
    if (String(year).length == 2) {
      year = 2024;
    }

    const month_map = new Map<string, string>();
    month_map.set("Jan", "Th01");
    month_map.set("Feb", "Th02");
    month_map.set("Mar", "Th03");
    month_map.set("Apr", "Th04");
    month_map.set("May", "Th05");
    month_map.set("Jun", "Th06");
    month_map.set("Jul", "Th07");
    month_map.set("Aug", "Th08");
    month_map.set("Sep", "Th09");
    month_map.set("Oct", "Th10");
    month_map.set("Nov", "Th11");
    month_map.set("Dec", "Th12");

    // Create a new Date object (months are zero-based in JavaScript Date)
    const dateObject = new Date(year, month - 1, day);

    // Get year, month, and day components from the date object
    const formattedYear = dateObject.getFullYear().toString().slice(2);
    const formattedMonth = month_map.get(
      dateObject.toLocaleString("default", { month: "long" }).slice(0, 3)
    );
    const formattedDay = String(dateObject.getDate()).padStart(2, "0");

    // Construct the formatted date string in the "yyyy-MM-dd" format
    const formattedDate = `${formattedDay}-${formattedMonth}-${formattedYear}`;

    return formattedDate;
  };

  export const DateToString = (date: Date) => {
    const y = date.getFullYear();
    const M = date.getMonth();
    const d = date.getDate();

    const month_map = new Map<number, string>();
    month_map.set(1, "Th01");
    month_map.set(2, "Th02");
    month_map.set(3, "Th03");
    month_map.set(4, "Th04");
    month_map.set(5, "Th05");
    month_map.set(6, "Th06");
    month_map.set(7, "Th07");
    month_map.set(8, "Th08");
    month_map.set(9, "Th09");
    month_map.set(10, "Th10");
    month_map.set(11, "Th11");
    month_map.set(12, "Th12");

    const y_str = String(y);
    const M_str = String(M + 1).padStart(2, "0");
    const d_str = String(d).padStart(2, "0");
    return `${d_str}-${M_str}-${y_str}`;
  };

  // Expected format: d/M/yy
  export const DateFromString = (str: string, delim?: string): Date => {
    const d = delim != undefined ? delim : "/";
    let [day, month, year] = str.split(d).map(Number);
    if (String(year).length == 2) {
      year = 2024;
    }

    Log(`day = ${day} month = ${month} year = ${year}`);

    const date = new Date();
    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(day);

    return date;
  };

  export const SortRecords = (records: WarehouseData.Record[]) => {
    const tmp: Map<number, { date: number; data: WarehouseData.Record }> = new Map();

    records.forEach((record, idx) => {
      const date = Common.DateFromString(record.ngay_thuc_te, "-");
      tmp.set(idx, { date: date.getTime(), data: record });
    });
    const sortedArr = Array.from(tmp.entries()).sort((a, b) => {
      return a[1].date - b[1].date;
    });

    const arr = new Map(sortedArr);

    const res: WarehouseData.Record[] = [];
    arr.forEach((value) => {
      res.push(value.data);
    });

    return res;
  };
}
