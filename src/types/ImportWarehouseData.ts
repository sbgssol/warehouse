import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { Dialog } from "./Dialog";

export module ImportData {
  class Products {
    ma_hang: string;
    ten_hang: string;
    don_vi_tinh: string;
    noi_xuat?: string;
    sl_nhap?: number;
    sl_xuat_gc?: number;
    sl_xuat_tp?: number;
    sl_ton_tp?: number;
    sl_ton_tt?: number;

    constructor(ma_hang: string, ten_hang: string, don_vi_tinh: string) {
      this.ma_hang = ma_hang;
      this.ten_hang = ten_hang;
      this.don_vi_tinh = don_vi_tinh;
    }
  }
  export class Data {
    hop_dong: string;
    so_bill: string;
    ngay_thuc_te: string;
    ngay_chung_tu: string;
    danh_sach_san_pham: Products[];

    constructor(hop_dong: string, so_bill: string, ngay_thuc_te: string, ngay_chung_tu: string) {
      this.hop_dong = hop_dong;
      this.so_bill = so_bill;
      this.ngay_thuc_te = ngay_thuc_te;
      this.ngay_chung_tu = ngay_chung_tu;
      this.danh_sach_san_pham = [];
    }

    CreateProduct(ma_hang: string, ten_hang: string, dvt: string, noi_xuat?: string, so_luong?: number) {
      this.danh_sach_san_pham.push({
        ma_hang: ma_hang,
        ten_hang: ten_hang,
        don_vi_tinh: dvt,
        noi_xuat: noi_xuat,
        sl_nhap: so_luong,
      });
    }

    ImportProduct(ma_hang: string, ten_hang: string, don_vi_tinh: string, noi_xuat: string, so_luong: number) {
      this.danh_sach_san_pham.push({
        ma_hang: ma_hang,
        ten_hang: ten_hang,
        don_vi_tinh: don_vi_tinh,
        noi_xuat: noi_xuat,
        sl_nhap: so_luong,
      });
    }

    ClearProduct() {
      this.danh_sach_san_pham = [];
    }

    StoreData = async (file_name: string, directory: BaseDirectory, append?: boolean) => {
      try {
        await writeTextFile(file_name, JSON.stringify(this) + "\n", {
          dir: directory,
          append: append,
        });
      } catch (error) {
        Dialog.Info(`Data could NOT be stored to ${directory.toString()}`, "Thông tin");
        // Dialog.Error(error as string);
        return;
      }
      // Dialog.Info(`Data stored to ${directory.toString()}`, "Thông tin");
    };
  }

  export const ToString = (data: Data) => {
    let str = `HỢP ĐỒNG: ${data.hop_dong}\n SỐ BILL: ${data.so_bill}\n NGÀY NHẬP THỰC TẾ: ${data.ngay_thuc_te}\n NGÀY CHỨNG TỪ: ${data.ngay_chung_tu}\n`;
    for (let i = 0; i < data.danh_sach_san_pham.length; ++i) {
      str += `  Mã hàng: ${data.danh_sach_san_pham[i].ma_hang}, Tên hàng: ${data.danh_sach_san_pham[i].ten_hang}, Đơn vị tính: ${data.danh_sach_san_pham[i].don_vi_tinh}, Số lượng: ${data.danh_sach_san_pham[i].sl_nhap}.\n`;
    }
    return str;
  };

  export const RestoreData = async (file_name: string, directory: BaseDirectory) => {
    const contents = await readTextFile(file_name, {
      dir: directory,
    });

    const objects = contents.split("\n");

    const records: Data[] = [];
    for (let i = 0; i < objects.length; ++i) {
      if (objects[i].length == 0) continue;
      const obj = JSON.parse(objects[i]) as Data;
      records.push(obj);
    }
    // console.log("Result: " + JSON.stringify(records));

    return records;
  };
}
