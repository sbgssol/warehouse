import GlobalStrings from "./Globals";

export class ShortenData {
  hop_dong: string;
  so_bill?: string;
  ngay_thuc_te: string;
  ngay_chung_tu?: string;
  noi_xuat?: string;
  sl_nhap?: number;
  sl_xuat_gc?: number;
  sl_xuat_tp?: number;
  sl_ton_tp?: number;
  sl_ton_tt?: number;
  readonly uid?: string;

  constructor(
    hop_dong: string,
    ngay_thuc_te: string,
    uid?: string,
    bill?: string,
    ngay_chung_tu?: string,
    noi_xuat?: string,
    sl_nhap?: number,
    sl_xuat_gc?: number,
    sl_xuat_tp?: number,
    sl_ton_tp?: number,
    sl_ton_tt?: number
  ) {
    this.hop_dong = hop_dong;
    this.so_bill = bill;
    this.ngay_thuc_te = ngay_thuc_te;
    this.ngay_chung_tu = ngay_chung_tu;
    this.noi_xuat = noi_xuat;
    this.sl_nhap = sl_nhap;
    this.sl_xuat_gc = sl_xuat_gc;
    this.sl_xuat_tp = sl_xuat_tp;
    this.sl_ton_tp = sl_ton_tp;
    this.sl_ton_tt = sl_ton_tt;
    this.uid = uid;
  }
}

export const CompareShortenData = (first: ShortenData, second: ShortenData) => {
  console.log(`Comparison -> \nFirst: ${JSON.stringify(first)}\nSecond: ${JSON.stringify(second)}`);

  return JSON.stringify(first) == JSON.stringify(second);
};

export const TraceChanges = (first: ShortenData, second: ShortenData) => {
  let msg = "Tracking changes: ";
  if (first.hop_dong != second.hop_dong) {
    msg += `\n${GlobalStrings.TableColumn.MaHD}: ${first.hop_dong} -> ${second.hop_dong}`;
  }
  if (first.so_bill != second.so_bill) {
    msg += `\n${GlobalStrings.TableColumn.SoBill}: ${first.so_bill} -> ${second.so_bill}`;
  }
  if (first.ngay_thuc_te != second.ngay_thuc_te) {
    msg += `\n${GlobalStrings.TableColumn.NgThTe}: ${first.ngay_thuc_te} -> ${second.ngay_thuc_te}`;
  }
  if (first.ngay_chung_tu != second.ngay_chung_tu) {
    msg += `\n${GlobalStrings.TableColumn.NgChTu}: ${first.ngay_chung_tu} -> ${second.ngay_chung_tu}`;
  }
  if (first.noi_xuat != second.noi_xuat) {
    msg += `\n${GlobalStrings.TableColumn.NoiXuat}: ${first.noi_xuat} -> ${second.noi_xuat}`;
  }
  if (first.sl_nhap != second.sl_nhap) {
    msg += `\n${GlobalStrings.TableColumn.Sl} ${GlobalStrings.TableColumn.Nhap}: ${first.sl_nhap} -> ${second.sl_nhap}`;
  }
  if (first.sl_xuat_gc != second.sl_xuat_gc) {
    msg += `\n${GlobalStrings.TableColumn.Sl} ${GlobalStrings.TableColumn.Xuat} ${GlobalStrings.TableColumn.Gc}: ${first.sl_xuat_gc} -> ${second.sl_xuat_gc}`;
  }
  if (first.sl_xuat_tp != second.sl_xuat_tp) {
    msg += `\n${GlobalStrings.TableColumn.Sl} ${GlobalStrings.TableColumn.Xuat} ${GlobalStrings.TableColumn.Tp}: ${first.sl_xuat_tp} -> ${second.sl_xuat_tp}`;
  }
  if (msg.length) {
    console.log(msg);
  }
};

export namespace UpdateRecord {
  export type Import = {
    so_bill: string;
    ngay_thuc_te: string;
    ngay_chung_tu: string;
    so_luong: number;
  };
  export type ExportType = "processing" | "production";

  export type Export = {
    noi_xuat: string;
    ngay_thuc_te: string;
    chi_tiet: {
      loai_xuat: ExportType;
      so_luong?: number;
    }[];
  };
  type Classification = "import" | "export";

  export class Details {
    phan_loai: Classification;
    chi_tiet: Export | Import;
    constructor(phan_loai: Classification, chi_tiet: Export | Import) {
      this.phan_loai = phan_loai;
      this.chi_tiet = chi_tiet;
    }
  }
}
