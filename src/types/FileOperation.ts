import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { resolveResource } from "@tauri-apps/api/path";

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
}
