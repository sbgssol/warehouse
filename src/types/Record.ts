import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";

export namespace WarehouseRecord {
  export type Record = {
    noi_xuat_gia_cong: string;
    ma_hang: string;
    so_bill: string;
    ngay_chung_tu: string;
    hop_dong: string;
    ngay_nhap_thuc_te: string;
    sl_nhap: number;
    sl_xuat_gc: number;
    sl_xuat_tp: number;
    sl_ton_tp: number;
    sl_ton_tt: number;
  };

  export const defaultRecord: Record = {
    noi_xuat_gia_cong: "?",
    ma_hang: "?",
    so_bill: "?",
    ngay_chung_tu: "?",
    hop_dong: "?",
    ngay_nhap_thuc_te: "?",
    sl_nhap: -1,
    sl_xuat_gc: -1,
    sl_xuat_tp: -1,
    sl_ton_tp: -1,
    sl_ton_tt: -1,
  };

  export async function StoreRecord(
    record: Record,
    file_name: string,
    directory: BaseDirectory,
    append?: boolean
  ) {
    await writeTextFile(file_name, JSON.stringify(record) + "\n", {
      dir: directory,
      append: append,
    });
  }
  export async function RestoreRecords(
    file_name: string,
    directory: BaseDirectory
  ) {
    const contents = await readTextFile(file_name, {
      dir: directory,
    });

    const objects = contents.split("\n");

    const records: Record[] = [];
    for (let i = 0; i < objects.length; ++i) {
      if (objects[i].length == 0) continue;
      records.push(JSON.parse(objects[i]) as Record);
    }
    return records;
  }
}
