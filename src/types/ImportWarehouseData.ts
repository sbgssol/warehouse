import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { Popup } from "./Dialog";
import { Common } from "./GlobalFnc";
import GlobalStrings from "./Globals";

export module WarehouseData {
  type RecordType = "import" | "export";
  type PhanLoaiNhap = {
    so_bill: string;
    ngay_chung_tu: string;
    so_luong: number;
  };
  type PhanLoaiXuat = {
    noi_xuat: string;
    gia_cong?: number;
    thanh_pham?: number;
  };
  type ChiTietPhanLoai = PhanLoaiNhap | PhanLoaiXuat;
  export class Products {
    ma_hang: string;
    uid?: string;
    phan_loai?: RecordType;
    chi_tiet?: ChiTietPhanLoai;
    noi_xuat?: string;
    sl_nhap?: number;
    sl_xuat_gc?: number;
    sl_xuat_tp?: number;
    sl_ton_tp?: number;
    sl_ton_tt?: number;

    constructor(ma_hang: string) {
      this.ma_hang = ma_hang;
    }
  }
  export class Record {
    hop_dong: string;
    ngay_thuc_te: string;
    so_bill?: string;
    ngay_chung_tu?: string;
    danh_sach_san_pham: Products[];

    constructor(hop_dong: string, ngay_thuc_te: string, so_bill?: string, ngay_chung_tu?: string) {
      this.hop_dong = hop_dong;
      this.so_bill = so_bill;
      this.ngay_thuc_te = ngay_thuc_te;
      this.ngay_chung_tu = ngay_chung_tu;
      this.danh_sach_san_pham = [];
    }

    CreateProduct(ma_hang: string, noi_xuat?: string, so_luong?: number) {
      this.danh_sach_san_pham.push({
        ma_hang: ma_hang,
        noi_xuat: noi_xuat,
        sl_nhap: so_luong
      });
    }

    ImportProduct(ma_hang: string, noi_xuat: string, so_luong: number) {
      this.danh_sach_san_pham.push({
        ma_hang: ma_hang,
        noi_xuat: noi_xuat,
        sl_nhap: so_luong
      });
    }

    public AddProduct(
      ma_hang: string,
      noi_xuat?: string,
      sl_nhap?: number,
      sl_xuat_gc?: number,
      sl_xuat_tp?: number
    ) {
      this.danh_sach_san_pham.push({
        ma_hang: ma_hang,
        noi_xuat: noi_xuat,
        sl_nhap: sl_nhap,
        sl_xuat_gc: sl_xuat_gc,
        sl_xuat_tp: sl_xuat_tp
      });
    }

    CreateUID = () => {
      this.danh_sach_san_pham.forEach((product) => {
        if (product.uid === undefined) {
          product.uid = Common.GetUID();
        }
      });
    };

    ClearProduct() {
      this.danh_sach_san_pham = [];
    }

    StoreData = async (file_name: string, directory: BaseDirectory, append?: boolean) => {
      try {
        this.CreateUID();
        await writeTextFile(file_name, JSON.stringify(this) + "\n", {
          dir: directory,
          append: append
        });
      } catch (error) {
        const folder_name = await Common.BaseDiToStr(directory);
        Popup.Error(`Không thể lưu dữ liệu vào\n${folder_name}`);
        Common.Log(`Failed to store "${file_name}" to "${await Common.BaseDiToStr(directory)}"`);
        return false;
      }
      Common.Log(`"${file_name}" stored to "${await Common.BaseDiToStr(directory)}"`);
      return true;
    };
  }

  export const ToString = (data: Record) => {
    let str = `HỢP ĐỒNG: ${data.hop_dong}\n\SỐ BILL: ${data.so_bill}\nNGÀY NHẬP THỰC TẾ: ${data.ngay_thuc_te}\nNGÀY CHỨNG TỪ: ${data.ngay_chung_tu}\n`;
    for (let i = 0; i < data.danh_sach_san_pham.length; ++i) {
      str += `  ${data.danh_sach_san_pham[i].ma_hang} -> nhập: ${data.danh_sach_san_pham[i].sl_nhap}, nơi xuất: ${data.danh_sach_san_pham[i].noi_xuat}, xuất gc: ${data.danh_sach_san_pham[i].sl_xuat_gc}, xuất tp: ${data.danh_sach_san_pham[i].sl_xuat_tp}.\n`;
    }
    return str;
  };

  export const RestoreData = async (file_name: string, directory: BaseDirectory) => {
    const contents = await readTextFile(file_name, {
      dir: directory
    });

    const objects = contents.split("\n");

    const records: Record[] = [];
    for (let i = 0; i < objects.length; ++i) {
      if (objects[i].length == 0) continue;
      const obj = JSON.parse(objects[i]) as Record;
      records.push(obj);
    }
    // console.log("Result: " + JSON.stringify(records));

    return records;
  };

  export const StoreDataPersistently = async (
    file_name: string,
    data: Record[],
    append?: boolean
  ) => {
    try {
      await writeTextFile(file_name, "", {
        dir: GlobalStrings.SaveDirectory,
        append: append
      });
      data.forEach(async (d) => {
        if (d.danh_sach_san_pham.length != 0) {
          await writeTextFile(file_name, JSON.stringify(d) + "\n", {
            dir: GlobalStrings.SaveDirectory,
            append: true
          });
        }
      });
    } catch (error) {
      Popup.Info(
        `Data could NOT be stored to ${GlobalStrings.SaveDirectory.toString()}`,
        "Thông tin"
      );
      // Dialog.Error(error as string);
      return -1;
    }
    // const dir = await Common.BaseDiToStr(directory)
    Common.Log(
      `"${file_name}" stored to "${await Common.BaseDiToStr(GlobalStrings.SaveDirectory)}"`
    );
    return 0;
  };
}
