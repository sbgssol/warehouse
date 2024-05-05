import { Button, IconButton } from "@material-tailwind/react";
import { WarehouseData } from "../types/ImportWarehouseData";
import { useState, useEffect } from "react";
import GlobalStrings from "../types/Globals";
import { NavbarDefault } from "./Navbar";
import { useGlobalState } from "../types/GlobalContext";
import { Popup } from "../types/Dialog";
import { ShortenData, UpdateRecord } from "../types/ShortenData";
import { CalculateStock } from "../types/CalculateStock";
import edit_svg from "../assets/edit-report-tiny.svg";
import delete_svg from "../assets/delete-report-tiny.svg";
import UpdateModal from "./single/UpdateModal";
import { Modify, Remove } from "../types/RecordModifier";
import { dialog } from "@tauri-apps/api";

export default function CreateReport() {
  const [restoredData, setRestoredData] = useState<WarehouseData.Record[]>([]);
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
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [dataToEdit, setDataToEdit] = useState<ShortenData>(new ShortenData("", "", "", ""));
  const [maHang, setMaHang] = useState("");
  // const [tenHang, setTenHang] = useState("");
  // const [dvt, setDvt] = useState("");
  // const [updatedData, setUpdatedData] = useState<ShortenData>();

  const stripeColumn = (index: number) => {
    let str = "";
    if (index % 2 == 0) {
      str = "bg-gray-100";
    }
    return str;
  };

  type Type = "name" | "unit";
  const getProductInfo = (code: string, type: Type) => {
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

  const handleRecordUpdate = (new_data?: UpdateRecord.Details) => {
    if (new_data === undefined) return;
    Modify(restoredData, dataToEdit, new_data, maHang, getRecordFilename());
    setOpenModalUpdate(false);
    setTimeout(() => {
      handleCheck();
    }, 100);
  };

  // useEffect(() => {
  //   console.log(`Record updated: ${JSON.stringify(updatedData)}`);

  //   return () => {};
  // }, [updatedData]);

  // useEffect(() => {
  //   if (dataToEdit.hop_dong.length) {
  //     console.log("New data :", JSON.stringify(dataToEdit));
  //     setTimeout(() => {
  //       setOpenModal(true);
  //     }, 200);
  //   }
  //   return () => {};
  // }, [dataToEdit]);

  const handleUpdateClick = (the_record: ShortenData, code: string) => {
    setOpenModalUpdate(true);
    setDataToEdit(the_record);
    setMaHang(code);
  };

  const handleRemoveClick = (old_record: ShortenData, product_code: string) => {
    setOpenModalDelete(true);
    setDataToEdit(old_record);
    setMaHang(product_code);
    // setTenHang(getProductInfo(product_code, "name"));
    // setDvt(getProductInfo(product_code, "unit"));
    // Remove(restoredData, old_record, product_code, getRecordFilename());
  };

  const handleRemoveRecord = async () => {
    const yes = await dialog.ask(`Bạn có chắc chắn muốn xóa?`, {
      cancelLabel: "KHÔNG",
      okLabel: "CÓ",
      type: "warning"
    });
    if (yes) {
      Remove(restoredData, dataToEdit, maHang, getRecordFilename());
      setOpenModalDelete(false);
      setTimeout(() => {
        handleCheck();
      }, 100);
    }
  };

  const summaryTable = () => {
    const str_col = "border border-gray-500 overflow-x-auto max-w-32";
    const num_col = "border border-gray-500 overflow-x-auto max-w-14";
    const tbl_header = "border border-gray-500 p-1 capitalize";

    return (
      <>
        <UpdateModal
          open={openModalUpdate}
          handler={() => {
            setOpenModalUpdate(false);
          }}
          ma_hang={maHang}
          product_map={productMap}
          data={dataToEdit}
          updater={handleRecordUpdate}
          type="update"></UpdateModal>

        <UpdateModal
          open={openModalDelete}
          handler={() => {
            setOpenModalDelete(false);
          }}
          ma_hang={maHang}
          product_map={productMap}
          data={dataToEdit}
          updater={handleRemoveRecord}
          type="delete"></UpdateModal>
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
                  <th className={`${tbl_header}`} rowSpan={3}>
                    {GlobalStrings.TableColumn.Update}
                  </th>
                  <th className={`${tbl_header}`} rowSpan={3}>
                    {GlobalStrings.TableColumn.Delete}
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
                      <td className={`${str_col}`}>{value.so_bill ?? "-"}</td>
                      <td className={`${str_col} w-20`}>{value.ngay_chung_tu ?? "-"}</td>
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
                      <td className={`${num_col} `} width={10}>
                        <div className="flex justify-center">
                          <IconButton
                            ripple={false}
                            variant="text"
                            className="p-0 m-0 rounded-none"
                            onClick={() => {
                              handleUpdateClick(data[innerIndex], key);
                            }}>
                            <img src={edit_svg}></img>
                          </IconButton>
                        </div>
                      </td>
                      <td className={`${num_col} `} width={10}>
                        <div className="flex justify-center">
                          <IconButton
                            ripple={false}
                            variant="text"
                            className="p-0 m-0 rounded-none"
                            onClick={() => {
                              handleRemoveClick(data[innerIndex], key);
                            }}>
                            <img src={delete_svg}></img>
                          </IconButton>
                        </div>
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
      const restored_data = await WarehouseData.RestoreData(
        getRecordFilename(),
        GlobalStrings.SaveDirectory
      );
      if (restored_data.length) {
        const tmp: WarehouseData.Record[] = [];
        restored_data.forEach((rec) => {
          tmp.push(rec);
          // dialog.message(ImportData.ToString(rec));
        });
        setRestoredData(tmp);
      } else {
        Popup.Warning("Không tìm thấy dữ liệu hoặc dữ liệu trống");
      }
    } catch (error) {
      const msg = contractName.length
        ? `${GlobalStrings.ErrorMsg.Report.ReportFileNotFound} "${contractName}"`
        : `${GlobalStrings.ErrorMsg.Report.ContractNotSelected}`;
      console.log(msg);
      Popup.Error(msg);
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
                record.ngay_thuc_te,
                record.so_bill,
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
                record.ngay_thuc_te,
                record.so_bill,
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
      <div className="max-w-full w-full">
        <Button onClick={handleCheck}>Kiểm tra</Button>
        {summaryTable()}
      </div>
    </>
  );
}
