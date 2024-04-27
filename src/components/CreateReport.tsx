import { Button } from "@material-tailwind/react";
import { ImportData } from "../types/ImportWarehouseData";
import { useState, useEffect } from "react";
import GlobalStrings from "../types/Globals";
import { NavbarDefault } from "./Navbar";
import { useGlobalState } from "../types/GlobalContext";
import { Dialog } from "../types/Dialog";
import { ShortenData } from "../types/ShortenData";
import { CalculateStock } from "../types/CalculateStock";

export default function CreateReport() {
  const [restoredData, setRestoredData] = useState<ImportData.Data[]>([]);
  const [productByCode, setProductByCode] = useState<Map<string, ShortenData[]>>(
    new Map<string, ShortenData[]>()
  );
  const [productSortedByDate, setProductSortedByDate] = useState<Map<string, ShortenData[]>>(
    new Map<string, ShortenData[]>()
  );
  const { contractName, getRecordFilename } = useGlobalState();
  const [productMap, setProductMap] = useState<Map<string, { name: string; unit: string }>>(
    new Map()
  );

  const stripeColumn = (index: number) => {
    let str = "";
    if (index % 2 == 0) {
      str = "bg-gray-100";
    }
    return str;
  };

  const getProductInfo = (code: string, type: string) => {
    let str = "?";
    const tmp = productMap.get(code);
    if (tmp) {
      if (type == "name") {
        str = tmp.name;
      } else if (type == "unit") {
        str = tmp.unit;
      } else {
        str = "?";
      }
    }
    return str;
  };

  const summaryTable = () => {
    const str_col = "border border-gray-500 overflow-x-auto max-w-32";
    const num_col = "border border-gray-500 overflow-x-auto max-w-14";
    const tbl_header = "border border-gray-500 p-1 capitalize";
    return (
      <>
        {Array.from(productSortedByDate).map(([key, data], index) => {
          return (
            <table key={index} className="text-center text-sm text-wrap mt-2 mb-2 max-w-full ">
              <thead className="text-left">
                <tr>
                  <th colSpan={2} className="">
                    Mã hàng:
                  </th>
                  <th colSpan={2}>{key}</th>
                </tr>
                <tr>
                  <th colSpan={2} className="">
                    Tên hàng:
                  </th>
                  <th colSpan={2}>{getProductInfo(key, "name")}</th>
                </tr>
                <tr>
                  <th colSpan={2} className="">
                    Đơn vị tính:
                  </th>
                  <th colSpan={2}>{getProductInfo(key, "unit")}</th>
                </tr>
              </thead>
              <thead>
                <tr>
                  <th rowSpan={3} className={`${tbl_header}`}>
                    {GlobalStrings.TableColumn.STT}
                  </th>
                  <th rowSpan={3} className={`${tbl_header}`}>
                    {GlobalStrings.TableColumn.NoiXuat}
                  </th>
                  <th rowSpan={3} className={`${tbl_header}`}>
                    {GlobalStrings.TableColumn.SoBill}
                  </th>
                  <th rowSpan={3} className={`${tbl_header}`}>
                    {GlobalStrings.TableColumn.NgChTu}
                  </th>
                  <th rowSpan={3} className={`${tbl_header}`}>
                    {GlobalStrings.TableColumn.MaHD}
                  </th>
                  <th rowSpan={3} className={`${tbl_header}`}>
                    {GlobalStrings.TableColumn.NgThTe}
                  </th>
                  <th className={`${tbl_header}`} colSpan={5}>
                    {GlobalStrings.TableColumn.Sl}
                  </th>
                </tr>
                <tr>
                  <th rowSpan={2} className={`${tbl_header}`}>
                    {GlobalStrings.TableColumn.Nhap}
                  </th>
                  <th colSpan={2} rowSpan={1} className={`${tbl_header}`}>
                    {GlobalStrings.TableColumn.Xuat}
                  </th>
                  <th colSpan={2} rowSpan={1} className={`${tbl_header}`}>
                    {GlobalStrings.TableColumn.Ton}
                  </th>
                </tr>
                <tr>
                  <th className={`${tbl_header}`}>{GlobalStrings.TableColumn.Gc}</th>
                  <th className={`${tbl_header}`}>{GlobalStrings.TableColumn.Tp}</th>
                  <th className={`${tbl_header}`}>{GlobalStrings.TableColumn.Tp}</th>
                  <th className={`${tbl_header}`}>{GlobalStrings.TableColumn.Tt}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((value, innerIndex) => {
                  const bold = innerIndex == data.length - 1 ? "font-bold" : "";
                  return (
                    <tr key={innerIndex} className={`${stripeColumn(innerIndex)}`}>
                      <td className={`${num_col}`}>{innerIndex + 1}</td>
                      <td className={`${str_col}`}>{value.noi_xuat ?? "-"}</td>
                      <td className={`${str_col}`}>{value.bill}</td>
                      <td className={`${str_col} w-20`}>{value.ngay_chung_tu}</td>
                      <td className={`${str_col}`}>{value.hop_dong}</td>
                      <td className={`${str_col} w-20`}>{value.ngay_thuc_te}</td>
                      <td className={`${num_col}`} width={50}>
                        {value.sl_nhap ?? "-"}
                      </td>
                      <td className={`${num_col}`} width={50}>
                        {value.sl_xuat_gc ?? "-"}
                      </td>
                      <td className={`${num_col}`} width={50}>
                        {value.sl_xuat_tp ?? "-"}
                      </td>
                      <td className={`${num_col} ${bold}`} width={50}>
                        {value.sl_ton_tp ?? "-"}
                      </td>
                      <td className={`${num_col} ${bold}`} width={50}>
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
    try {
      const restored_data = await ImportData.RestoreData(
        getRecordFilename(),
        GlobalStrings.SaveDirectory
      );
      if (restored_data.length) {
        const tmp: ImportData.Data[] = [];
        restored_data.forEach((rec) => {
          tmp.push(rec);
          // dialog.message(ImportData.ToString(rec));
        });
        setRestoredData(tmp);
      } else {
        Dialog.Warning("Không tìm thấy dữ liệu hoặc dữ liệu trống");
      }
    } catch (error) {
      console.log(error);
      Dialog.Error(`Không tìm thấy dữ liệu của mã hợp đồng "${contractName}"`);
    }
  };

  useEffect(() => {
    const tmp = new Map<string, ShortenData[]>();
    const map_tmp = new Map<string, { name: string; unit: string }>();
    if (restoredData.length > 0) {
      restoredData.forEach((record) => {
        record.danh_sach_san_pham.forEach((product) => {
          map_tmp.set(product.ma_hang, {
            name: product.ten_hang,
            unit: product.don_vi_tinh
          });
          const prod = tmp.get(product.ma_hang);
          if (prod) {
            prod.push(
              new ShortenData(
                record.hop_dong,
                record.so_bill,
                record.ngay_thuc_te,
                record.ngay_chung_tu,
                product.noi_xuat,
                product.sl_nhap,
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
                product.sl_nhap,
                product.sl_xuat_gc,
                product.sl_xuat_tp,
                product.sl_ton_tp,
                product.sl_ton_tt
              )
            ]);
          }
        });
      });
    }
    setProductByCode(tmp);
    setProductMap(map_tmp);

    return () => {};
  }, [restoredData]);

  useEffect(() => {
    const sorted: Map<string, ShortenData[]> = new Map();
    if (productByCode.size) {
      let code = "";
      let data: ShortenData[] = [];

      productByCode.forEach((value, key) => {
        const tmp: Map<number, { date: number; data: ShortenData }> = new Map();
        value.forEach((data, index) => {
          tmp.set(index, { date: Date.parse(data.ngay_thuc_te), data: data });
        });

        const sortedArr = Array.from(tmp.entries()).sort((a, b) => {
          return a[1].date - b[1].date;
        });

        const arr = new Map(sortedArr);

        arr.forEach((value) => {
          code = key;
          data.push(value.data);
        });

        sorted.set(code, data);
        code = "";
        data = [];
      });
    }
    const tmp = CalculateStock(sorted);
    setProductSortedByDate(tmp);

    return () => {};
  }, [productByCode]);

  return (
    <>
      <NavbarDefault></NavbarDefault>
      <div className="max-w-full">
        <Button onClick={handleCheck}>Kiểm tra</Button>
        {summaryTable()}
      </div>
    </>
  );
}
