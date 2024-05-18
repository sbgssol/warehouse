import { path } from "@tauri-apps/api";
import { BaseDirectory } from "@tauri-apps/api/fs";

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

  export const ParseDate = (str: string) => {
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
}
