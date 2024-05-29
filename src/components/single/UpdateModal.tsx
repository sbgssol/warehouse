import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import { ShortenData, UpdateRecord } from "../../types/ShortenData";
import { ChangeEvent, useEffect, useState } from "react";
import GlobalStrings from "../../types/Globals";
import ArrayToSelect from "../ArrayToSelect";
import { useGlobalState } from "../../types/GlobalContext";
import { Common } from "../../types/GlobalFnc";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function UpdateModal(props: {
  open: boolean;
  handler: () => void;
  ma_hang: string;
  product_map: Map<string, { name: string; unit: string }>;
  data: ShortenData;
  updater: ((new_data: UpdateRecord.Details) => void) | (() => void);
  type: "update" | "delete";
}) {
  // States
  const [hopdong, setHopdong] = useState("");
  const [bill, setBill] = useState<string | undefined>();
  const [location, setLocation] = useState<string | undefined>();
  // const [docDate, setDocDate] = useState("");
  // const [realDate, setRealDate] = useState("");
  const [importAmount, setImportAmount] = useState("");
  const [exportProcessing, setExportProcessing] = useState("");
  const [exportProduction, setExportProduction] = useState("");
  const [maHang, setMaHang] = useState("");
  const [tenHang, setTenHang] = useState("");
  const [isImport, setIsImport] = useState(false);
  const { json } = useGlobalState();
  const [dateReal, setDateReal] = useState(new Date());
  const [dateDoc, setDateDoc] = useState(new Date());

  // Ref
  //
  useEffect(() => {
    if (props.open) {
      console.log("Modifying: ", JSON.stringify(props.data));
      setMaHang(props.ma_hang);
      const tmp = props.product_map.get(props.ma_hang);
      if (tmp !== undefined) {
        setTenHang(tmp.name);
      }
      setHopdong(props.data.hop_dong);
      setBill(props.data.so_bill);
      setLocation(props.data.noi_xuat);
      setDateDoc(
        props.data.ngay_chung_tu !== undefined
          ? Common.DateFromString(props.data.ngay_chung_tu, "-")
          : new Date()
      );
      setDateReal(Common.DateFromString(props.data.ngay_thuc_te, "-"));
      setImportAmount(props.data.sl_nhap ? String(props.data.sl_nhap) : "");
      setExportProcessing(props.data.sl_xuat_gc ? String(props.data.sl_xuat_gc) : "");
      setExportProduction(props.data.sl_xuat_tp ? String(props.data.sl_xuat_tp) : "");
      setIsImport(props.data.so_bill !== undefined);

      // console.log(`type: ${props.type}`);
    }
    return () => {};
  }, [props.data, props.product_map, props.open]);

  const ModifyImport = () => {
    const phan_loai = "import";
    const chi_tiet = {
      ngay_chung_tu: Common.DateToString(dateDoc),
      ngay_thuc_te: Common.DateToString(dateReal),
      so_bill: bill,
      so_luong: Number(importAmount)
    } as UpdateRecord.Import;
    props.updater({ phan_loai: phan_loai, chi_tiet: chi_tiet });
  };
  const ModifyExport = () => {
    const phan_loai = "export";
    let xuat: { loai_xuat: UpdateRecord.ExportType; so_luong?: number }[] = [];
    if (exportProcessing == "0") {
      xuat.push({ loai_xuat: "processing" });
    } else {
      xuat.push({ loai_xuat: "processing", so_luong: Number(exportProcessing) });
    }
    if (exportProduction == "0") {
      xuat.push({ loai_xuat: "production" });
    } else {
      xuat.push({ loai_xuat: "production", so_luong: Number(exportProduction) });
    }

    const chi_tiet = {
      ngay_thuc_te: Common.DateToString(dateReal),
      noi_xuat: location,
      chi_tiet: xuat
    } as UpdateRecord.Export;
    props.updater({ phan_loai: phan_loai, chi_tiet: chi_tiet });
  };

  const handleSaveClick = async () => {
    if (isImport) {
      ModifyImport();
    } else {
      ModifyExport();
    }
  };

  const handleDeleteClick = () => {
    (props.updater as () => void)();
  };

  const disabled_delete =
    props.type == "delete" ? "disabled:border-gray-400 disabled:bg-gray-100" : "";
  // console.log(`disabled: ${props.type == "delete"}, disabled_delete: ${disabled_delete}`);

  const ImportEntries = () => {
    if (isImport) {
      return (
        <>
          <tr className="">
            <td>
              <div className="flex justify-between w-full">
                <div className="w-1/3 flex items-center justify-end capitalize pr-4">
                  <p>{GlobalStrings.TableColumn.SoBill}</p>
                </div>
                <div className="w-2/3 mb-2">
                  <input
                    disabled={props.type == "delete"}
                    value={bill}
                    className={`p-1 pl-2 border-2 border-teal-700 rounded-md w-full focus:outline-none ${disabled_delete}`}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setBill(e.target.value);
                    }}></input>
                </div>
              </div>
            </td>
          </tr>
          <tr className="">
            <td>
              <div className="flex justify-between w-full">
                <div className="w-1/3 flex items-center justify-end capitalize pr-4">
                  <p>{GlobalStrings.TableColumn.NgThTe}</p>
                </div>
                <div className="w-2/3 mb-2">
                  <div className={`w-full`}>
                    <DatePicker
                      className={`rounded-md p-1 pl-2 `}
                      selected={dateReal}
                      onChange={(date) => {
                        if (date) {
                          setDateReal(date);
                        }
                      }}
                      dateFormat={"dd-MM-yyyy"}
                    />
                  </div>
                  {/* <input
                    disabled={props.type == "delete"}
                    type="date"
                    value={realDate}
                    className={`p-1 pl-2 border-2 border-teal-700 rounded-md w-full focus:outline-none ${disabled_delete}`}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setRealDate(e.target.value);
                    }}></input> */}
                </div>
              </div>
            </td>
          </tr>
          <tr className="">
            <td>
              <div className="flex justify-between w-full">
                <div className="w-1/3 flex items-center justify-end capitalize pr-4">
                  <p>{GlobalStrings.TableColumn.NgChTu}</p>
                </div>
                <div className="w-2/3 mb-2">
                  <div className={`w-full`}>
                    <DatePicker
                      className={`rounded-md p-1 pl-2`}
                      selected={dateDoc}
                      onChange={(date) => {
                        if (date) {
                          setDateDoc(date);
                        }
                      }}
                      dateFormat={"dd-MM-yyyy"}
                    />
                  </div>
                </div>
              </div>
            </td>
          </tr>

          <tr className="">
            <td>
              <div className="flex justify-between w-full">
                <div className="w-1/3 flex items-center justify-end capitalize pr-4">
                  <p>
                    {GlobalStrings.TableColumn.Sl} {GlobalStrings.TableColumn.Nhap}
                  </p>
                </div>
                <div className="w-2/3 mb-2">
                  <input
                    disabled={props.type == "delete"}
                    type={"number"}
                    value={importAmount}
                    className={`p-1 pl-2 border-2 border-teal-700 rounded-md w-full focus:outline-none ${disabled_delete}`}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if ((e.target.value as unknown as number) < 0) {
                        e.target.value = "0";
                      }
                      setImportAmount(e.target.value);
                    }}></input>
                </div>
              </div>
            </td>
          </tr>
        </>
      );
    }
    return <></>;
  };
  const ExportEntries = () => {
    if (!isImport) {
      return (
        <>
          <tr className="">
            <td>
              <div className="flex justify-between w-full">
                <div className="w-1/3 flex items-center justify-end capitalize pr-4">
                  <p>{GlobalStrings.TableColumn.NoiXuat}</p>
                </div>
                <div className="w-2/3 mb-2">
                  <ArrayToSelect
                    disabled={props.type == "delete"}
                    arr={json.rawNoiXuat ?? [""]}
                    default={location}
                    onChange={(value) => {
                      setLocation(value);
                    }}
                    select_class_twstyles={`p-1.5 pl-2 border-2 border-teal-700 rounded-md w-full focus:outline-none ${disabled_delete}`}></ArrayToSelect>
                </div>
              </div>
            </td>
          </tr>

          <tr className="">
            <td>
              <div className="flex justify-between w-full">
                <div className="w-1/3 flex items-center justify-end capitalize pr-4">
                  <p>{GlobalStrings.TableColumn.NgThTe}</p>
                </div>
                <div className="w-2/3 mb-2">
                  <div className={`w-full`}>
                    <DatePicker
                      className={`rounded-md p-1 pl-2 `}
                      selected={dateReal}
                      onChange={(date) => {
                        if (date) {
                          setDateReal(date);
                        }
                      }}
                      dateFormat={"dd-MM-yyyy"}
                    />
                  </div>
                </div>
              </div>
            </td>
          </tr>

          <tr className="">
            <td>
              <div className="flex justify-between w-full">
                <div className="w-1/3 flex items-center justify-end capitalize pr-4">
                  SL {GlobalStrings.TableColumn.Xuat} GC
                </div>
                <div className="w-2/3 mb-2">
                  <input
                    type={"number"}
                    disabled={props.type == "delete"}
                    value={exportProcessing.length > 0 ? exportProcessing : "0"}
                    className={`p-1 pl-2 border-2 border-teal-700 rounded-md w-full focus:outline-none ${disabled_delete}`}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if ((e.target.value as unknown as number) <= 0) {
                        e.target.value = "0";
                      }
                      setExportProcessing(e.target.value);
                    }}></input>
                </div>
              </div>
            </td>
          </tr>
          <tr className="">
            <td>
              <div className="flex justify-between w-full">
                <div className="w-1/3 flex items-center justify-end capitalize pr-4">
                  SL {GlobalStrings.TableColumn.Xuat} TP
                </div>
                <div className="w-2/3 mb-2">
                  <input
                    type={"number"}
                    disabled={props.type == "delete"}
                    value={exportProduction.length > 0 ? exportProduction : "0"}
                    className={`p-1 pl-2 border-2 border-teal-700 rounded-md w-full focus:outline-none ${disabled_delete}`}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (
                        (e.target.value as unknown as number) <= 0 ||
                        e.target.value.length == 0
                      ) {
                        e.target.value = "0";
                      }
                      setExportProduction(e.target.value);
                    }}></input>
                </div>
              </div>
            </td>
          </tr>
        </>
      );
    }
    return <></>;
  };
  const FixedEntries = () => {
    const fixed_twstyles = "border-2 border-gray-500 text-gray-500 hover:cursor-not-allowed";
    return (
      <>
        <tr className={``}>
          <td>
            <div className="flex justify-between w-full">
              <div className="w-1/3 flex items-center justify-end capitalize pr-4">
                <p>Mã hàng</p>
              </div>
              <div className="w-2/3 mb-2">
                <input
                  defaultValue={maHang}
                  disabled={true}
                  className={`p-1 pl-2 ${fixed_twstyles} rounded-md w-full focus:outline-none ${disabled_delete}`}></input>
              </div>
            </div>
          </td>
        </tr>
        <tr className="">
          <td>
            <div className="flex justify-between w-full">
              <div className="w-1/3 flex items-center justify-end capitalize pr-4">
                <p>Tên hàng</p>
              </div>
              <div className="w-2/3 mb-2">
                <input
                  defaultValue={tenHang}
                  disabled={true}
                  className={`p-1 pl-2 ${fixed_twstyles} rounded-md w-full focus:outline-none ${disabled_delete}`}></input>
              </div>
            </div>
          </td>
        </tr>
        <tr className="">
          <td>
            <div className="flex justify-between w-full">
              <div className="w-1/3 flex items-center justify-end capitalize pr-4">
                <p>{GlobalStrings.TableColumn.MaHD}</p>
              </div>
              <div className="w-2/3 mb-2">
                <input
                  value={hopdong}
                  disabled={true}
                  className={`p-1 pl-2 ${fixed_twstyles} rounded-md w-full focus:outline-none ${disabled_delete}`}></input>
              </div>
            </div>
          </td>
        </tr>
      </>
    );
  };

  const Buttons = () => {
    if (props.type == "update") {
      return (
        <>
          <div className="flex justify-between w-full">
            <Button onClick={props.handler} color="red">
              Hủy
            </Button>
            <Button color="green" onClick={handleSaveClick}>
              Lưu
            </Button>
          </div>
        </>
      );
    }
    return (
      <>
        <div className="flex justify-between w-full">
          <Button onClick={props.handler} color="gray">
            Hủy
          </Button>
          <Button color="red" onClick={handleDeleteClick}>
            Xóa
          </Button>
        </div>
      </>
    );
  };

  return (
    <Dialog open={props.open} handler={props.handler} size="sm">
      <DialogHeader className="pb-0">
        <div className="w-full text-center">
          {props.type == "delete" ? "Xóa dữ liệu " : "Chỉnh sửa thông tin "}
          {isImport ? GlobalStrings.TableColumn.Nhap : GlobalStrings.TableColumn.Xuat}
        </div>
      </DialogHeader>
      <DialogBody className="pb-0">
        <table className="w-full">
          <tbody className="">
            {FixedEntries()}
            {ImportEntries()}
            {ExportEntries()}
          </tbody>
        </table>
      </DialogBody>
      <DialogFooter>
        <div className="flex justify-between w-full">{Buttons()}</div>
      </DialogFooter>
    </Dialog>
  );
}
