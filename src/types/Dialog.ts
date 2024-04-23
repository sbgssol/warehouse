import { dialog } from "@tauri-apps/api";

export module Dialog {
  export const Info = (msg: string, title: string) => {
    dialog.message(msg, { title: title, type: "info" });
  };

  export const Warning = (msg: string) => {
    dialog.message(msg, { title: "Cảnh báo", type: "warning" });
  };

  export const Error = (msg: string) => {
    dialog.message(msg, { title: "Lỗi", type: "error" });
  };
}
