import {
  Button,
  Card,
  CardBody,
  IconButton,
  Radio,
  Tooltip,
  Typography
} from "@material-tailwind/react";
import { WarehouseData } from "../types/ImportWarehouseData";
import { useState, useEffect } from "react";
import GlobalStrings from "../types/Globals";
import { NavbarDefault } from "./Navbar";
import { useGlobalState } from "../types/GlobalContext";
import { ShortenData, UpdateRecord } from "../types/ShortenData";
import { CalculateStock } from "../types/CalculateStock";
import edit_svg from "../assets/edit-report-tiny.svg";
import delete_svg from "../assets/delete-report-tiny.svg";
import UpdateModal from "./single/UpdateModal";
import { AddStock, Modify, Remove } from "../types/RecordModifier";
import { dialog } from "@tauri-apps/api";
import import_stock from "../assets/import-stock.svg";
import InputStock from "./single/InputStock";
import { FileOperation } from "../types/FileOperation";
import ArrayToSelect from "./ArrayToSelect";
import PleaseWait from "./single/PleaseWait";
import AutoCompleteInput from "./single/AutoCompleteInput";
import { Common } from "../types/GlobalFnc";

export default function CreateReport() {
  const [restoredData, setRestoredData] = useState<WarehouseData.Record[]>([]);
  const [productByCode, setProductByCode] = useState<Map<string, ShortenData[]>>(
    new Map<string, ShortenData[]>()
  );
  const [productSortedByDate, setProductSortedByDate] = useState<Map<string, ShortenData[]>>(
    new Map<string, ShortenData[]>()
  );
  const [loadedProductCodes, setLoadedProductCodes] = useState<string[]>();
  const [currentSelectedData, setCurrentSelectedData] = useState<Map<string, ShortenData[]>>();

  const { contractName, getRecordFilename } = useGlobalState();
  // const [productMap, setProductMap] = useState<Map<string, { name: string; unit: string }>>(
  //   new Map()
  // );
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalStock, setOpenModalStock] = useState(false);
  const [dataToEdit, setDataToEdit] = useState<ShortenData>(new ShortenData("", "", "", ""));
  const [maHang, setMaHang] = useState("");
  const [checkClicked, setCheckClicked] = useState(false);
  const { popup, product, json, wait } = useGlobalState();
  const [viewAll, setViewAll] = useState(false);

  type CongCuoiKi = {
    nhap: number;
    xuat_gc: number;
    xuat_tp: number;
    ton_tp: number;
    ton_tt: number;
  };
  const [congCuoiKi, setCongCuoiKi] = useState<Map<string, CongCuoiKi>>(
    new Map<string, CongCuoiKi>()
  );

  const CalculateSummary = (data: Map<string, ShortenData[]>) => {
    const tmp = new Map<string, CongCuoiKi>();

    data.forEach((records, code) => {
      let cuoi_ki = {
        nhap: 0,
        xuat_gc: 0,
        xuat_tp: 0,
        ton_tp: 0,
        ton_tt: 0
      } as CongCuoiKi;
      records.forEach((value) => {
        cuoi_ki.nhap += Number(Number(value.sl_nhap ?? 0).toFixed(4));
        cuoi_ki.xuat_gc += Number(Number(value.sl_xuat_gc ?? 0).toFixed(4));
        cuoi_ki.xuat_tp += Number(Number(value.sl_xuat_tp ?? 0).toFixed(4));
        cuoi_ki.ton_tp = Number(Number(value.sl_ton_tp ?? 0).toFixed(4));
        cuoi_ki.ton_tt = Number(Number(value.sl_ton_tt ?? 0).toFixed(4));
      });
      tmp.set(code, cuoi_ki);
    });

    setCongCuoiKi(tmp);
  };

  const stripeColumn = (index: number) => {
    let str = "";
    if (index % 2 == 0) {
      str = "bg-gray-100";
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

  const handleUpdateClick = (the_record: ShortenData, code: string) => {
    setOpenModalUpdate(true);
    setDataToEdit(the_record);
    setMaHang(code);
  };

  const handleRemoveClick = (old_record: ShortenData, product_code: string) => {
    setOpenModalDelete(true);
    setDataToEdit(old_record);
    setMaHang(product_code);
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

  const handleInputStockOk = async (amount: number) => {
    await AddStock(getRecordFilename(), restoredData, maHang, amount);

    setTimeout(() => {
      handleCheck();
    }, 200);
    setOpenModalStock(false);
  };

  const NeedInputStock = (records: ShortenData[], code?: string) => {
    console.log(`Checking for code ${code}, data:\n${JSON.stringify(records)}`);

    if (records.some((value) => value.so_bill === GlobalStrings.InputStock)) {
      console.log(`-> true`);
      return false;
    }
    console.log(`-> true`);
    return true;
  };

  const SelectData = (value: string) => {
    const data: Map<string, ShortenData[]> = new Map<string, ShortenData[]>();
    const tmp = productSortedByDate.get(value);
    if (tmp) {
      if (data.get(value) === undefined) {
        data.set(value, tmp);
      }
    }
    setCurrentSelectedData(data);
  };

  useEffect(() => {
    if (productSortedByDate.size) {
      Common.Log(`Product sorted by date changed:`);
      productSortedByDate.forEach((records, code) => {
        Common.Log(`${code}\n  ${JSON.stringify(records)}`);
      });
    }

    return () => {};
  }, [productSortedByDate]);

  const ProductSelect = () => {
    if (viewAll) return "";
    const select_twstyles =
      "border-green-700 border-2 rounded-md p-1 w-[100%] text-center text-lg font-bold text-green-700 focus:outline-none";
    const option_twstyles = "text-[16px] font-myThin font-bold";
    // setCurrentSelectedData(new Map<string, ShortenData[]>());
    if (loadedProductCodes !== undefined) {
      return (
        <div className={`w-full flex flex-col items-center mt-4`}>
          <div className={`w-full flex justify-end items-center`}>
            <AutoCompleteInput
              label={<Typography className={`mr-2`}>{"Tìm mã sản phẩm"}</Typography>}
              data_source={loadedProductCodes}
              input_class_twstyles={
                "w-full px-2 py-1 rounded-md font-myThin font-bold border-2 border-green-700 focus:outline-none"
              }
              list_class_twstyles={`bg-light-green-50 border-2 rounded-md border-green-600`}
              list_item_class_twstyles={`px-1 py-2 rounded-md font-myThin font-bold text-black`}
              div_wrapper_class_twstyes={`w-[80%]`}
              item_selected_handler={SelectData}></AutoCompleteInput>
          </div>
          <div className={`w-full flex items-center justify-center`}>
            <div className={`w-[20%] text-right pr-2`}>
              <Typography>Chọn một mã hàng để xem chi tiết</Typography>
            </div>
            <div className={`w-[80%]`}>
              <ArrayToSelect
                arr={loadedProductCodes}
                onChange={SelectData}
                select_class={select_twstyles}
                option_class={option_twstyles}></ArrayToSelect>
            </div>
          </div>
        </div>
      );
    }
    return "";
  };
  const TableDetails = () => {
    if (currentSelectedData === undefined) return "";

    const str_col = "border border-gray-500 overflow-x-auto max-w-32";
    const num_col = "border border-gray-500 overflow-x-auto max-w-14";
    const tbl_header = "border border-gray-500 p-1 capitalize";
    return (
      <>
        {Array.from(currentSelectedData).map(([key, data], index) => {
          return (
            <table key={index} className="text-center text-sm text-wrap mt-2 mb-2 w-full">
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
                  <th colSpan={2}>{product.getInfo(key, "name")}</th>
                </tr>
                <tr>
                  <th colSpan={2} className="">
                    Đơn vị tính:
                  </th>
                  <th colSpan={2}>{product.getInfo(key, "unit")}</th>
                </tr>
                <tr>
                  {/* <th colSpan={2} className=""></th> */}
                  <th colSpan={3}>
                    <Button
                      className={`p-1 rounded-md`}
                      variant="gradient"
                      color="blue-gray"
                      disabled={!NeedInputStock(data, key)}
                      onClick={() => {
                        setMaHang(key);
                        setOpenModalStock(true);
                      }}>
                      <div className="flex items-center justify-evenly">
                        {"nhập tồn đầu kì"}
                        <span>
                          <img width={32} src={import_stock} alt="" className="pl-1" />
                        </span>
                      </div>
                    </Button>
                  </th>
                </tr>
              </thead>
              <thead>
                <tr>
                  <th rowSpan={3} className={`${tbl_header} w-[2%]`}>
                    {GlobalStrings.TableColumn.STT}
                  </th>
                  <th rowSpan={3} className={`${tbl_header} w-[10%]`}>
                    {GlobalStrings.TableColumn.NoiXuat}
                  </th>
                  <th rowSpan={3} className={`${tbl_header} w-[15%]`}>
                    {GlobalStrings.TableColumn.SoBill}
                  </th>
                  <th rowSpan={3} className={`${tbl_header} w-[9%]`}>
                    {GlobalStrings.TableColumn.NgChTu}
                  </th>
                  <th rowSpan={3} className={`${tbl_header} w-[17%]`}>
                    {GlobalStrings.TableColumn.MaHD}
                  </th>
                  <th rowSpan={3} className={`${tbl_header} w-[9%]`}>
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
                  return (
                    <tr key={innerIndex} className={`${stripeColumn(innerIndex)}`}>
                      <td className={`${num_col}`}>{innerIndex + 1}</td>
                      <td className={`${str_col}`}>{value.noi_xuat ?? "-"}</td>
                      <td className={`${str_col}`}>{value.so_bill ?? "-"}</td>
                      <td className={`${str_col} w-20`}>
                        {value.ngay_chung_tu !== undefined
                          ? Common.ParseDateReport(value.ngay_chung_tu, "-")
                          : "-"}
                      </td>
                      <td className={`${str_col}`}>{value.hop_dong}</td>
                      <td className={`${str_col} w-20`}>
                        {Common.ParseDateReport(value.ngay_thuc_te, "-")}
                      </td>
                      <td className={`${num_col}`} width={50}>
                        {value.sl_nhap ?? "-"}
                      </td>
                      <td className={`${num_col}`} width={50}>
                        {value.sl_xuat_gc ?? "-"}
                      </td>
                      <td className={`${num_col}`} width={50}>
                        {value.sl_xuat_tp ?? "-"}
                      </td>
                      <td className={`${num_col}`} width={50}>
                        {value.sl_ton_tp ?? "-"}
                      </td>
                      <td className={`${num_col}`} width={50}>
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
              <tbody>
                <tr className="uppercase font-bold">
                  <td colSpan={6} className={`text-right pr-2 ${num_col}`}>
                    cộng cuối kì
                  </td>
                  <td className={`${num_col}`}>{congCuoiKi.get(key)?.nhap}</td>
                  <td className={`${num_col}`}>{congCuoiKi.get(key)?.xuat_gc}</td>
                  <td className={`${num_col}`}>{congCuoiKi.get(key)?.xuat_tp}</td>
                  <td className={`${num_col}`}>{congCuoiKi.get(key)?.ton_tp}</td>
                  <td className={`${num_col}`}>{congCuoiKi.get(key)?.ton_tt}</td>
                </tr>
              </tbody>
            </table>
          );
        })}{" "}
      </>
    );
  };

  const Wait = () => {
    if (wait.waiting) {
      return <PleaseWait />;
    }
    return <></>;
  };

  const summaryTable = () => {
    return (
      <>
        {Wait()}
        {ProductSelect()}
        {TableDetails()}
      </>
    );
  };

  const handleCheck = async () => {
    setRestoredData([]);
    product.constructProductMap(json.rawMaHang ?? [""]);
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
        setCheckClicked(true);
        setRestoredData(tmp);
      } else {
        popup.show("Không tìm thấy dữ liệu hoặc dữ liệu trống", "error");
      }
    } catch (error) {
      const msg = contractName.length
        ? `${GlobalStrings.ErrorMsg.Report.ReportFileNotFound} "${contractName}"`
        : `${GlobalStrings.ErrorMsg.Report.ContractNotSelected}`;
      console.log(msg);

      popup.show(msg, "error");
    }
  };

  useEffect(() => {
    const tmp = new Map<string, ShortenData[]>();
    // const map_tmp = new Map<string, { name: string; unit: string }>();
    if (restoredData.length > 0) {
      restoredData.forEach((record) => {
        record.danh_sach_san_pham.forEach((innerProd) => {
          // map_tmp.set(innerProd.ma_hang, {
          //   name: product.getInfo(innerProd.ma_hang, "name"),
          //   unit: product.getInfo(innerProd.ma_hang, "unit")
          // });
          const prod = tmp.get(innerProd.ma_hang);
          if (prod) {
            prod.push(
              new ShortenData(
                record.hop_dong,
                record.ngay_thuc_te,
                record.so_bill,
                record.ngay_chung_tu,
                innerProd.noi_xuat,
                innerProd.sl_nhap,
                innerProd.sl_xuat_gc,
                innerProd.sl_xuat_tp,
                innerProd.sl_ton_tp,
                innerProd.sl_ton_tt
              )
            );
          } else {
            tmp.set(innerProd.ma_hang, [
              new ShortenData(
                record.hop_dong,
                record.ngay_thuc_te,
                record.so_bill,
                record.ngay_chung_tu,
                innerProd.noi_xuat,
                innerProd.sl_nhap,
                innerProd.sl_xuat_gc,
                innerProd.sl_xuat_tp,
                innerProd.sl_ton_tp,
                innerProd.sl_ton_tt
              )
            ]);
          }
        });
      });
    } else {
      setCheckClicked(false);
    }
    setProductByCode(tmp);
    // setProductMap(map_tmp);

    return () => {};
  }, [restoredData]);

  useEffect(() => {
    const sorted: Map<string, ShortenData[]> = new Map();
    if (productByCode.size) {
      let code = "";
      let data: ShortenData[] = [];
      const prod_code_list: Set<string> = new Set<string>();

      productByCode.forEach((value, key) => {
        const tmp: Map<number, { date: number; data: ShortenData }> = new Map();
        value.forEach((data, index) => {
          prod_code_list.add(key);
          Common.Log(`data.ngay_thuc_te -> ${data.ngay_thuc_te}`);
          const date = Common.DateFromString(data.ngay_thuc_te, "-");
          tmp.set(index, { date: date.getTime(), data: data });
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
      setLoadedProductCodes(Array.from(prod_code_list).sort());
    }
    const tmp = CalculateStock(sorted);
    CalculateSummary(tmp);
    setProductSortedByDate(tmp);
    setCurrentSelectedData(tmp);

    return () => {};
  }, [productByCode]);

  const handleCreateTheKho = () => {
    let data: FileOperation.Report.TheKhoType[] = [];
    productSortedByDate.forEach((value, key) => {
      data.push({
        ma_hang: key,
        ten_hang: product.getInfo(key, "name"),
        dvt: product.getInfo(key, "unit"),
        data_by_date: value
      });
    });
    FileOperation.Report.CreateTheKho(data, congCuoiKi);
  };

  const handleCreateBcqt = () => {
    const data = FileOperation.Report.RecordsToBCQt(
      restoredData,
      product.map,
      contractName,
      "",
      ""
    );
    FileOperation.Report.CreateBaoCaoQuyetToan(data);
  };
  const Radios = () => {
    return (
      <div className="flex w-full justify-evenly items-center">
        <Radio
          name="color"
          color="blue"
          label={
            <div className={`flex flex-col items-center w-max hover:scale-105`}>
              <Typography className={`text-md uppercase ${BoldRadioLabel(true)}`}>
                tất cả
              </Typography>
              {/* <img src={svg_robot} className={`w-[48px]`} /> */}
            </div>
          }
          checked={viewAll}
          onChange={() => {
            setViewAll(!viewAll);
            // wait.setWaiting(true);
            setCurrentSelectedData(productSortedByDate);
            // setTimeout(() => {
            //   wait.setWaiting(false);
            // }, 1000);
          }}
        />
        <Radio
          name="color"
          color="green"
          label={
            <div className={`flex flex-col items-center w-max hover:scale-105`}>
              <Typography className={`text-md uppercase ${BoldRadioLabel(false)}`}>
                theo mã hàng
              </Typography>
              {/* <img src={svg_box} className={`w-[48px]`} /> */}
            </div>
          }
          checked={!viewAll}
          onChange={() => {
            setViewAll(!viewAll);
            setCurrentSelectedData(undefined);
          }}
          className={``}
        />
      </div>
    );
  };

  // const [viewAllSwOn, setViewAllSwOn] = useState<boolean>(false);

  // const ViewAllSwitch = () => {
  //   const txt_twstyles = "w-[110px] uppercase";
  //   return (
  //     <div className={`w-full flex justify-center items-center space-x-2`}>
  //       <Typography className={`text-right ${txt_twstyles}`}>{"tất cả"}</Typography>
  //       <Switch
  //         color="teal"
  //         ripple={false}
  //         checked={viewAllSwOn}
  //         onChange={() => {
  //           const newValue = !viewAllSwOn;
  //           setViewAllSwOn(newValue);
  //           Common.Log(`switch changed: ${newValue}`);
  //         }}
  //         className={`bg-blue-600 p-0`}
  //       />
  //       <Typography className={`text-left ${txt_twstyles}`}>{"theo mã hàng"}</Typography>
  //     </div>
  //   );
  // };

  const CreateCheckButton = () => {
    const btn_twstyles = "w-[130px] py-1.5 hover:scale-105 hover:-translate-y-0.5";
    if (contractName.length == 0) {
      return (
        <Tooltip
          content="Hãy chọn hợp đồng"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 }
          }}
          className={`bg-red-300 `}>
          <span>
            <Button
              color="lime"
              className={`${btn_twstyles}`}
              // onClick={handleCheck}
              disabled={true}>
              <Typography>kiểm tra</Typography>
            </Button>
          </span>
        </Tooltip>
      );
    }
    return (
      <Button color="lime" className={`${btn_twstyles}`} onClick={handleCheck}>
        <Typography>kiểm tra</Typography>
      </Button>
    );
  };

  const CreateExcelButtons = () => {
    const btn_twstyles = "w-[130px] py-1.5 hover:scale-105 hover:-translate-y-0.5";
    if (checkClicked) {
      return (
        <>
          <Button
            color="light-green"
            variant="gradient"
            // disabled={!checkClicked}
            className={`${btn_twstyles}`}
            onClick={handleCreateTheKho}>
            <Typography>thẻ kho</Typography>
          </Button>
          <Button
            color="green"
            variant="gradient"
            // disabled={!checkClicked}
            className={`${btn_twstyles}`}
            onClick={handleCreateBcqt}>
            <Typography>bcqt</Typography>
          </Button>
        </>
      );
    }
    return (
      <Tooltip
        content="Hãy kiểm tra dữ liệu trước khi xuất"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0, y: 25 }
        }}
        className={`bg-red-300 `}>
        <div className={`space-x-2`}>
          <Button
            color="light-green"
            variant="gradient"
            disabled={true}
            className={`${btn_twstyles}`}
            // onClick={handleCreateTheKho}
          >
            <Typography>thẻ kho</Typography>
          </Button>
          <Button
            color="green"
            variant="gradient"
            disabled={true}
            className={`${btn_twstyles}`}
            // onClick={handleCreateBcqt}
          >
            <Typography>bcqt</Typography>
          </Button>
        </div>
      </Tooltip>
    );
  };

  const Buttons = () => {
    return (
      <div className={`w-full flex justify-center items-center`}>
        <Card className={`border`}>
          <CardBody className={`p-2 space-y-2`}>
            <div className={`w-full flex justify-center`}>{CreateCheckButton()}</div>
            {Radios()}
            <div className={`space-x-2 `}>
              <Typography className={`w-full text-center capitalize font-bold`}>
                {"xuất file excel"}
              </Typography>
              {CreateExcelButtons()}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  };

  const BoldRadioLabel = (expected: boolean) => {
    let str_twstyles = "";
    if (expected == true) {
      str_twstyles = "text-blue-500";
    } else {
      str_twstyles = "text-green-500";
    }
    if (viewAll != expected) {
      str_twstyles = "";
    }
    return viewAll == expected ? str_twstyles + " font-bold" : str_twstyles + "";
  };

  return (
    <>
      <NavbarDefault></NavbarDefault>
      <InputStock
        open={openModalStock}
        closeHandler={() => setOpenModalStock(false)}
        okHandler={handleInputStockOk}
        product_code={maHang}
        product_name={product.getInfo(maHang, "name")}></InputStock>
      <UpdateModal
        open={openModalUpdate}
        handler={() => {
          setOpenModalUpdate(false);
        }}
        ma_hang={maHang}
        product_map={product.map}
        data={dataToEdit}
        updater={handleRecordUpdate}
        type="update"></UpdateModal>

      <UpdateModal
        open={openModalDelete}
        handler={() => {
          setOpenModalDelete(false);
        }}
        ma_hang={maHang}
        product_map={product.map}
        data={dataToEdit}
        updater={handleRemoveRecord}
        type="delete"></UpdateModal>
      <div className="max-w-full w-full">
        {Buttons()}
        {summaryTable()}
      </div>
    </>
  );
}
