import { Popup } from "./Dialog";
import { Common } from "./GlobalFnc";
import GlobalStrings from "./Globals";
import { WarehouseData } from "./ImportWarehouseData";
import { ShortenData, UpdateRecord } from "./ShortenData";

export type ChangedCategory =
  | "ma_hop_dong"
  | "so_bill"
  | "ngay_thuc_te"
  | "ngay_chung_tu"
  | "ma_hang"
  | "noi_xuat"
  | "sl_nhap"
  | "sl_xuat_gc"
  | "sl_xuat_tp";

export type ToBeChangedRecord = {
  ma_hop_dong?: string;
  so_bill?: string;
  ngay_thuc_te?: string;
  ngay_chung_tu?: string;
  ma_hang?: string;
  noi_xuat?: string;
  sl_nhap?: number;
  sl_xuat_gc?: number;
  sl_xuat_tp?: number;
};

// export const GetChangedCategories = (
//   old_record: ToBeChangedRecord,
//   new_record: ToBeChangedRecord
// ) => {
//   let changes: { category: ChangedCategory; old?: string; new?: string }[] = [];
//   if (old_record.ma_hop_dong != new_record.ma_hop_dong) {
//     changes.push({
//       category: "ma_hop_dong",
//       old: old_record.ma_hop_dong,
//       new: new_record.ma_hop_dong
//     });
//   }
//   if (old_record.so_bill != new_record.so_bill) {
//     changes.push({
//       category: "so_bill",
//       old: old_record.so_bill,
//       new: new_record.so_bill
//     });
//   }
//   if (old_record.ngay_thuc_te != new_record.ngay_thuc_te) {
//     changes.push({
//       category: "ngay_thuc_te",
//       old: old_record.ngay_thuc_te,
//       new: new_record.ngay_thuc_te
//     });
//   }
//   if (old_record.ngay_chung_tu != new_record.ngay_chung_tu) {
//     changes.push({
//       category: "ngay_chung_tu",
//       old: old_record.ngay_chung_tu,
//       new: new_record.ngay_chung_tu
//     });
//   }
//   if (old_record.ma_hang != new_record.ma_hang) {
//     changes.push({
//       category: "ma_hang",
//       old: old_record.ma_hang,
//       new: new_record.ma_hang
//     });
//   }
//   if (old_record.noi_xuat != new_record.noi_xuat) {
//     changes.push({
//       category: "noi_xuat",
//       old: old_record.noi_xuat,
//       new: new_record.noi_xuat
//     });
//   }
//   if (old_record.sl_nhap != new_record.sl_nhap) {
//     changes.push({
//       category: "sl_nhap",
//       old: String(old_record.sl_nhap),
//       new: String(new_record.sl_nhap)
//     });
//   }
//   if (old_record.sl_xuat_gc != new_record.sl_xuat_gc) {
//     changes.push({
//       category: "sl_xuat_gc",
//       old: String(old_record.sl_xuat_gc),
//       new: String(new_record.sl_xuat_gc)
//     });
//   }
//   if (old_record.sl_xuat_tp != new_record.sl_xuat_tp) {
//     changes.push({
//       category: "sl_xuat_tp",
//       old: String(old_record.sl_xuat_tp),
//       new: String(new_record.sl_xuat_tp)
//     });
//   }
//   return changes;
// };

// const HopDongChanged = (
//   full_data: WarehouseData.Record[],
//   ma_hang: string,
//   changed_record: ShortenData
// ) => {
//   full_data.forEach((original_record) => {
//     if (original_record.so_bill === changed_record.so_bill &&
//       original_record.ngay_thuc_te === changed_record.ngay_thuc_te
//     ) {}
//   })
// };

const FindMatchRecord = (
  full_data: WarehouseData.Record[],
  target_record: ShortenData,
  code: string
) => {
  let indices: { contract_idx: number | undefined; record_idx: number | undefined } = {
    contract_idx: undefined,
    record_idx: undefined
  };
  full_data.forEach((data, index) => {
    if (target_record.hop_dong === data.hop_dong) {
      if (target_record.ngay_thuc_te === data.ngay_thuc_te) {
        indices.contract_idx = index;
        data.danh_sach_san_pham.forEach((product, innerIdx) => {
          if (product.ma_hang == code) {
            indices.record_idx = innerIdx;
          }
        });
      }
    }
  });

  console.log(`FindMatchRecord -> ${JSON.stringify(indices)}`);

  return indices;
};

// return {record_idx, product_idx}[]
const FindMatchRecordByUid = (full_data: WarehouseData.Record[], uid: string[]) => {
  let idx = new Map<number, number[]>();
  const set_uid = new Set(uid);

  for (let record_idx = 0; record_idx < full_data.length; record_idx++) {
    const record = full_data[record_idx];
    for (let product_idx = 0; product_idx < record.danh_sach_san_pham.length; product_idx++) {
      const product = record.danh_sach_san_pham[product_idx];
      if (product.uid !== undefined && set_uid.has(product.uid)) {
        Common.Log(`Found uid ${product.uid}`);
        if (idx.get(record_idx) === undefined) {
          idx.set(record_idx, []);
        }
        idx.get(record_idx)?.push(product_idx);
      }
    }
  }

  idx = new Map([...idx.entries()].sort((a, b) => b[0] - a[0]));
  const arr = Array.from(idx.entries());
  Common.Log(`arr: ${JSON.stringify(arr)}`);
  const res = JSON.parse(JSON.stringify(arr)) as [number, number[]][];
  Common.Log(`res: ${JSON.stringify(res)}`);
  arr.forEach((value, idx) => {
    res[idx][1] = JSON.parse(JSON.stringify(value[1].sort((a, b) => b - a))) as number[];
  });
  return res;
  // console.log(`FindMatchRecord -> ${JSON.stringify(indices)}`);
  // return indices;
};

export const Modify = (
  full_data: WarehouseData.Record[],
  the_old_data: ShortenData,
  the_new_data: UpdateRecord.Details,
  code: string,
  file_name: string
) => {
  const idx = FindMatchRecord(full_data, the_old_data, code);
  if (idx.contract_idx === undefined || idx.record_idx === undefined) {
    return;
  }
  const contract_idx = idx.contract_idx;
  const record_idx = idx.record_idx;

  full_data[contract_idx].ngay_thuc_te = the_new_data.chi_tiet.ngay_thuc_te;
  if (the_new_data.phan_loai == "import") {
    const details = the_new_data.chi_tiet as UpdateRecord.Import;
    full_data[contract_idx].ngay_chung_tu = details.ngay_chung_tu;
    full_data[contract_idx].ngay_thuc_te = details.ngay_thuc_te;
    full_data[contract_idx].so_bill = details.so_bill;
    full_data[contract_idx].danh_sach_san_pham[record_idx].sl_nhap = details.so_luong;
  } else if (the_new_data.phan_loai == "export") {
    console.log(JSON.stringify(full_data[contract_idx]));
    const details = the_new_data.chi_tiet as UpdateRecord.Export;
    full_data[contract_idx].ngay_thuc_te = details.ngay_thuc_te;
    full_data[contract_idx].danh_sach_san_pham[record_idx].noi_xuat = details.noi_xuat;
    details.chi_tiet.forEach((value) => {
      if (value.loai_xuat == "processing") {
        full_data[contract_idx].danh_sach_san_pham[record_idx].sl_xuat_gc = value.so_luong;
      } else if (value.loai_xuat == "production") {
        full_data[contract_idx].danh_sach_san_pham[record_idx].sl_xuat_tp = value.so_luong;
      } else {
        Popup.Error(`Invalid updting classification`);
      }
    });
  } else {
    Popup.Error(`Invalid updting classification`);
  }

  WarehouseData.StoreDataPersistently(file_name, full_data);
};

export const Remove = (
  full_data: WarehouseData.Record[],
  old_record: ShortenData,
  product_code: string,
  file_name: string
) => {
  const idx = FindMatchRecord(full_data, old_record, product_code);
  if (idx.contract_idx === undefined || idx.record_idx === undefined) {
    return;
  }
  // console.log(`Data before:\n${JSON.stringify(full_data[idx.contract_idx].danh_sach_san_pham)}\n`);

  full_data[idx.contract_idx].danh_sach_san_pham.splice(idx.record_idx, 1);

  // console.log(`Data after:\n${JSON.stringify(full_data[idx.contract_idx].danh_sach_san_pham)}\n`);

  WarehouseData.StoreDataPersistently(file_name, full_data);
};

export const RemoveByUid = (
  full_data: WarehouseData.Record[],
  uid: string[],
  file_name: string
) => {
  const idx = FindMatchRecordByUid(full_data, uid);
  Common.Log(`Remove by uid -> idx\n${JSON.stringify(idx)}`);
  // return;
  idx.forEach((value) => {
    const rec_idx = value[0];
    value[1].forEach((prod_idx) => {
      full_data[rec_idx].danh_sach_san_pham.splice(prod_idx, 1);
    });
  });
  WarehouseData.StoreDataPersistently(file_name, full_data);
};

function formatDate(date: Date): string {
  const year = date.getFullYear();
  let month: string | number = date.getMonth() + 1; // Month is zero-based
  let day: string | number = date.getDate();

  // Add leading zeros if needed
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }

  return `${year}-${month}-${day}`;
}

export const AddStock = async (
  report_file_name: string,
  full_data: WarehouseData.Record[],
  prod_code: string,
  // prod_name: string,
  // prod_unit: string,
  amount: number
) => {
  const now = new Date();
  const year = now.getFullYear();
  const firstDayOfYear = new Date(year, 0, 1); // January is 0
  const formattedDate = formatDate(firstDayOfYear);
  const record: WarehouseData.Record = new WarehouseData.Record(
    GlobalStrings.InputStock,
    formattedDate,
    GlobalStrings.InputStock
  );
  record.danh_sach_san_pham.push({ ma_hang: prod_code, sl_nhap: amount });
  full_data.push(record);
  WarehouseData.StoreDataPersistently(report_file_name, full_data);
};

export type ImportUpdate = {
  so_bill: string;
  ngay_chung_tu: string;
  ngay_thuc_te: string;
  sl_nhap: number;
};

export type ExportUpdate = {
  noi_xuat: string;
  ngay_thuc_te: string;
  xuat_gc?: number;
  xuat_tp?: number;
};
