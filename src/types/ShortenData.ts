export class ShortenData {
  hop_dong: string;
  bill: string;
  ngay_thuc_te: string;
  ngay_chung_tu: string;
  noi_xuat?: string;
  sl_nhap?: number;
  sl_xuat_gc?: number;
  sl_xuat_tp?: number;
  sl_ton_tp?: number;
  sl_ton_tt?: number;

  constructor(
    hop_dong: string,
    bill: string,
    ngay_thuc_te: string,
    ngay_chung_tu: string,
    noi_xuat?: string,
    sl_nhap?: number,
    sl_xuat_gc?: number,
    sl_xuat_tp?: number,
    sl_ton_tp?: number,
    sl_ton_tt?: number
  ) {
    this.hop_dong = hop_dong;
    this.bill = bill;
    this.ngay_thuc_te = ngay_thuc_te;
    this.ngay_chung_tu = ngay_chung_tu;
    this.noi_xuat = noi_xuat;
    this.sl_nhap = sl_nhap;
    this.sl_xuat_gc = sl_xuat_gc;
    this.sl_xuat_tp = sl_xuat_tp;
    this.sl_ton_tp = sl_ton_tp;
    this.sl_ton_tt = sl_ton_tt;
  }
}
