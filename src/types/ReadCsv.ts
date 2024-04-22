import { resolveResource } from "@tauri-apps/api/path";
// alternatively, use `window.__TAURI__.path.resolveResource`
import { readTextFile } from "@tauri-apps/api/fs";
// alternatively, use `window.__TAURI__.fs.readTextFile`

export const ReadCsvToStrArr = async (file_name: string) => {
  const resourcePath = await resolveResource(file_name);
  // dialog.message(resourcePath);
  const data = await readTextFile(resourcePath);

  let res = [];
  if (data.indexOf("\r\n")) {
    res = data.split("\r\n");
  } else {
    res = data.split("\n");
  }
  console.log(`reading "${file_name}" -> ${res}`);
  return res;
};
