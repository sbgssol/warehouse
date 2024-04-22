import { Button } from "@material-tailwind/react";
import { ImportData } from "../types/ImportWarehouseData";
import { dialog } from "@tauri-apps/api";
import { useState, useEffect } from "react";
import TableColumn from "../types/TableStrings";
import GlobalStrings from "../types/Globals";
import { NavbarDefault } from "./Navbar";

export default function CreateReport() {
  class ShortenData {
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

  const [restoredData, setRestoredData] = useState<ImportData.Data[]>([]);
  const [productByCode, setProductByCode] = useState<Map<string, ShortenData[]>>(new Map<string, ShortenData[]>());
  const [productSortedByDate, setProductSortedByDate] = useState<Map<string, ShortenData[]>>(new Map<string, ShortenData[]>());

  const stripeColumn = (index: number) => {
    let str = "";
    if (index % 2 == 0) {
      str = "bg-gray-100";
    }
    return str;
  };

  const summaryTable = () => {
    return (
      <>
        {Array.from(productSortedByDate).map(([key, data], index) => {
          return (
            <table key={index} className="text-center text-sm text-wrap mt-2">
              <thead>
                <tr>
                  <th colSpan={2} className="text-left">
                    Ma hang
                  </th>
                  <th>{key}</th>
                </tr>
              </thead>
              <thead>
                <tr>
                  <th rowSpan={3} className="border border-gray-500 p-1">
                    {TableColumn.STT}
                  </th>
                  <th rowSpan={3} className="border border-gray-500 p-1">
                    {TableColumn.NoiXuat}
                  </th>
                  <th rowSpan={3} className="border border-gray-500 p-1">
                    {TableColumn.SoBill}
                  </th>
                  <th rowSpan={3} className="border border-gray-500 p-1">
                    {TableColumn.NgChTu}
                  </th>
                  <th rowSpan={3} className="border border-gray-500 p-1">
                    {TableColumn.MaHD}
                  </th>
                  <th rowSpan={3} className="border border-gray-500 p-1">
                    {TableColumn.NgThTe}
                  </th>
                  <th className="border border-gray-500" colSpan={5}>
                    {TableColumn.Sl}
                  </th>
                </tr>
                <tr>
                  <th rowSpan={2} className="border border-gray-500">
                    {TableColumn.Nhap}
                  </th>
                  <th colSpan={2} rowSpan={1} className="border border-gray-500">
                    {TableColumn.Xuat}
                  </th>
                  <th colSpan={2} rowSpan={1} className="border border-gray-500">
                    {TableColumn.Ton}
                  </th>
                </tr>
                <tr>
                  <th className="border border-gray-500">{TableColumn.Gc}</th>
                  <th className="border border-gray-500">{TableColumn.Tp}</th>
                  <th className="border border-gray-500">{TableColumn.Tp}</th>
                  <th className="border border-gray-500">{TableColumn.Tt}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((value, innerIndex) => {
                  return (
                    <tr key={innerIndex} className={`${stripeColumn(innerIndex)}`}>
                      <td className="border border-gray-500">{innerIndex + 1}</td>
                      <td className="border border-gray-500">{value.noi_xuat ?? "-"}</td>
                      <td className="border border-gray-500">{value.bill}</td>
                      <td className="border border-gray-500">{value.ngay_chung_tu}</td>
                      <td className="border border-gray-500">{value.hop_dong}</td>
                      <td className="border border-gray-500">{value.ngay_thuc_te}</td>
                      <td className="border border-gray-500" width={50}>
                        {value.sl_nhap ?? "-"}
                      </td>
                      <td className="border border-gray-500" width={50}>
                        {value.sl_xuat_gc ?? "-"}
                      </td>
                      <td className="border border-gray-500" width={50}>
                        {value.sl_xuat_tp ?? "-"}
                      </td>
                      <td className="border border-gray-500" width={50}>
                        {value.sl_ton_tp ?? "-"}
                      </td>
                      <td className="border border-gray-500" width={50}>
                        {value.sl_ton_tt ?? "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          );
        })}
      </>
    );
  };

  const handleCheck = async () => {
    setRestoredData([]);
    let restored_data = await ImportData.RestoreData(GlobalStrings.FileName, GlobalStrings.SaveDirectory);
    if (restored_data.length) {
      let tmp: ImportData.Data[] = [];
      restored_data.forEach((rec) => {
        tmp.push(rec);
        // dialog.message(ImportData.ToString(rec));
      });
      setRestoredData(tmp);
    } else {
      dialog.message("Không thể tải dữ liệu");
    }
  };

  useEffect(() => {
    if (restoredData.length > 0) {
      let tmp = new Map<string, ShortenData[]>();
      restoredData.forEach((record) => {
        record.danh_sach_san_pham.forEach((product) => {
          let prod = tmp.get(product.ma_hang);
          if (prod) {
            prod.push(
              new ShortenData(
                record.hop_dong,
                record.so_bill,
                record.ngay_thuc_te,
                record.ngay_chung_tu,
                product.noi_xuat,
                product.sl_nhap as unknown as number,
                product.sl_xuat_gc,
                product.sl_xuat_tp,
                product.sl_ton_tp,
                product.sl_ton_tt
              )
            );
          } else {
            tmp.set(product.ma_hang, [
              new ShortenData(
                record.hop_dong,
                record.so_bill,
                record.ngay_thuc_te,
                record.ngay_chung_tu,
                product.noi_xuat,
                product.sl_nhap as unknown as number,
                product.sl_xuat_gc,
                product.sl_xuat_tp,
                product.sl_ton_tp,
                product.sl_ton_tt
              ),
            ]);
          }
        });
      });
      setProductByCode(tmp);
    }

    return () => {};
  }, [restoredData]);

  useEffect(() => {
    if (productByCode.size) {
      let sorted: Map<string, ShortenData[]> = new Map();
      let code = "";
      let data: ShortenData[] = [];

      productByCode.forEach((value, key) => {
        let tmp: Map<number, { date: number; data: ShortenData }> = new Map();
        value.forEach((data, index) => {
          tmp.set(index, { date: Date.parse(data.ngay_thuc_te), data: data });
        });

        let sortedArr = Array.from(tmp.entries()).sort((a, b) => {
          return a[1].date - b[1].date;
        });

        let arr = new Map(sortedArr);

        let str = "";
        arr.forEach((value, innerKey) => {
          str += `${innerKey}:${value.data.ngay_thuc_te}\n`;
          code = key;
          data.push(value.data);
        });

        sorted.set(code, data);
        code = "";
        data = [];
      });

      setProductSortedByDate(sorted);
    }

    return () => {};
  }, [productByCode]);

  return (
    <>
      <div className="">
        <NavbarDefault></NavbarDefault>
        <Button onClick={handleCheck}>Kiểm tra</Button>
        {summaryTable()}
      </div>
    </>
  );
}
