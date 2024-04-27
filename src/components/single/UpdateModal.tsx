import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import { ShortenData } from "../../types/ShortenData";
import { ChangeEvent, useEffect, useState } from "react";
import GlobalStrings from "../../types/Globals";
import CsvToSelect from "../CsvToSelect";

export default function UpdateModal(props: {
  open: boolean;
  handler: () => void;
  data: ShortenData;
}) {
  // States
  const [hopdong, setHopdong] = useState("");
  const [bill, setBill] = useState("");
  const [location, setLocation] = useState("");
  const [docDate, setDocDate] = useState("");
  const [realDate, setRealDate] = useState("");
  const [importAmount, setImportAmount] = useState("");
  const [exportProcessing, setExportProcessing] = useState("");
  const [exportProduction, setExportProduction] = useState("");
  //
  useEffect(() => {
    console.log("Modifying: ", JSON.stringify(props.data));
    setHopdong(props.data.hop_dong);
    setBill(props.data.bill);
    setLocation(props.data.noi_xuat ?? "-");
    setDocDate(props.data.ngay_chung_tu == "-" ? "" : props.data.ngay_chung_tu);
    setRealDate(props.data.ngay_thuc_te);
    setImportAmount(props.data.sl_nhap ? String(props.data.sl_nhap) : "-");
    setExportProcessing(props.data.sl_xuat_gc ? String(props.data.sl_xuat_gc) : "-");
    setExportProduction(props.data.sl_xuat_tp ? String(props.data.sl_xuat_tp) : "-");
    return () => {};
  }, [props.data]);

  return (
    <Dialog open={props.open} handler={props.handler} size="sm">
      <DialogHeader className="pb-0">
        <div className="w-full text-center">Chỉnh sửa thông tin</div>
      </DialogHeader>
      <DialogBody className="pb-0">
        <table className="w-full">
          <tbody className="">
            <tr className="">
              <td>
                <div className="flex justify-between w-full">
                  <div className="w-1/2 flex items-center justify-end capitalize pr-4">
                    <p>{GlobalStrings.TableColumn.MaHD}</p>
                  </div>
                  <div className="w-1/2 mb-2">
                    <input
                      value={hopdong}
                      className="p-1 pl-2 border-2 border-teal-700 rounded-md w-full focus:outline-none"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setHopdong(e.target.value);
                      }}></input>
                  </div>
                </div>
              </td>
            </tr>
            <tr className="">
              <td>
                <div className="flex justify-between w-full">
                  <div className="w-1/2 flex items-center justify-end capitalize pr-4">
                    <p>{GlobalStrings.TableColumn.SoBill}</p>
                  </div>
                  <div className="w-1/2 mb-2">
                    <input
                      value={bill}
                      className="p-1 pl-2 border-2 border-teal-700 rounded-md w-full focus:outline-none"
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
                  <div className="w-1/2 flex items-center justify-end capitalize pr-4">
                    <p>{GlobalStrings.TableColumn.NoiXuat}</p>
                  </div>
                  <div className="w-1/2 mb-2">
                    <CsvToSelect
                      file_name={GlobalStrings.ReleaseLocationFileName}
                      target_column={0}
                      onChange={(value) => {
                        setLocation(value);
                      }}
                      select_class="p-1 pl-2 border-2 border-teal-700 rounded-md w-full focus:outline-none"></CsvToSelect>
                    {/* <input
                      value={location}
                      className="p-1 pl-2 border-2 border-teal-700 rounded-md w-full focus:outline-none"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setLocation(e.target.value);
                      }}></input> */}
                  </div>
                </div>
              </td>
            </tr>
            <tr className="">
              <td>
                <div className="flex justify-between w-full">
                  <div className="w-1/2 flex items-center justify-end capitalize pr-4">
                    <p>{GlobalStrings.TableColumn.NgChTu}</p>
                  </div>
                  <div className="w-1/2 mb-2">
                    <input
                      type="date"
                      value={docDate}
                      className="p-1 pl-2 border-2 border-teal-700 rounded-md w-full focus:outline-none"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setDocDate(e.target.value);
                      }}></input>
                  </div>
                </div>
              </td>
            </tr>
            <tr className="">
              <td>
                <div className="flex justify-between w-full">
                  <div className="w-1/2 flex items-center justify-end capitalize pr-4">
                    <p>{GlobalStrings.TableColumn.NgThTe}</p>
                  </div>
                  <div className="w-1/2 mb-2">
                    <input
                      type="date"
                      value={realDate}
                      className="p-1 pl-2 border-2 border-teal-700 rounded-md w-full focus:outline-none"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setRealDate(e.target.value);
                      }}></input>
                  </div>
                </div>
              </td>
            </tr>
            <tr className="">
              <td>
                <div className="flex justify-between w-full">
                  <div className="w-1/2 flex items-center justify-end capitalize pr-4">
                    <p>
                      {GlobalStrings.TableColumn.Sl} {GlobalStrings.TableColumn.Nhap}
                    </p>
                  </div>
                  <div className="w-1/2 mb-2">
                    <input
                      type={props.data.sl_nhap ? "number" : ""}
                      value={importAmount}
                      className="p-1 pl-2 border-2 border-teal-700 rounded-md w-full focus:outline-none"
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
            <tr className="">
              <td>
                <div className="flex justify-between w-full">
                  <div className="w-1/2 flex items-center justify-end capitalize pr-4">
                    {GlobalStrings.TableColumn.Sl} {GlobalStrings.TableColumn.Xuat}{" "}
                    {GlobalStrings.TableColumn.Gc}
                  </div>
                  <div className="w-1/2 mb-2">
                    <input
                      type={props.data.sl_xuat_gc ? "number" : ""}
                      value={exportProcessing}
                      className="p-1 pl-2 border-2 border-teal-700 rounded-md w-full focus:outline-none"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setExportProcessing(e.target.value);
                      }}></input>
                  </div>
                </div>
              </td>
            </tr>
            <tr className="">
              <td>
                <div className="flex justify-between w-full">
                  <div className="w-1/2 flex items-center justify-end capitalize pr-4">
                    {GlobalStrings.TableColumn.Sl} {GlobalStrings.TableColumn.Xuat}{" "}
                    {GlobalStrings.TableColumn.Tp}
                  </div>
                  <div className="w-1/2 mb-2">
                    <input
                      type={props.data.sl_xuat_tp ? "number" : ""}
                      value={exportProduction}
                      className="p-1 pl-2 border-2 border-teal-700 rounded-md w-full focus:outline-none"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setExportProduction(e.target.value);
                      }}></input>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </DialogBody>
      <DialogFooter>
        <div className="flex justify-between w-full">
          <Button onClick={props.handler} color="red">
            Hủy
          </Button>
          <Button color="green">Lưu</Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
