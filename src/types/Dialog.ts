import { dialog } from "@tauri-apps/api";

export module Popup {
  export const Info = (msg: string, title?: string) => {
    dialog.message(msg, { title: title ?? "Thông báo", type: "info" });
  };

  export const Warning = (msg: string) => {
    dialog.message(msg, { title: "Cảnh báo", type: "warning" });
  };

  export const Error = (msg: string) => {
    dialog.message(msg, { title: "Lỗi", type: "error" });
  };
}
