import {
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
  DialogFooter,
  Button
} from "@material-tailwind/react";
import ArrayToSelect from "../ArrayToSelect";
import { useEffect, useState } from "react";
import { FileOperation } from "../../types/FileOperation";
import { Common } from "../../types/GlobalFnc";

interface ExcelFormatSelectProps {
  open: boolean;
  closeHandler: () => void;
  doneHandler: (cols: FileOperation.ExcelColumns) => void;
  columns?: FileOperation.ExcelColumns;
}

export type ExcelColumnPosition = {
  ma_hang: number;
  so_luong: number;
};

export default function ExcelFormatSelect(props: ExcelFormatSelectProps) {
  const EXCEL_COLUMNS = new Map<number, string>();
  EXCEL_COLUMNS.set(0, "A");
  EXCEL_COLUMNS.set(1, "B");
  EXCEL_COLUMNS.set(2, "C");
  EXCEL_COLUMNS.set(3, "D");
  EXCEL_COLUMNS.set(4, "E");
  EXCEL_COLUMNS.set(5, "F");
  EXCEL_COLUMNS.set(6, "G");
  EXCEL_COLUMNS.set(7, "H");
  EXCEL_COLUMNS.set(8, "I");
  EXCEL_COLUMNS.set(9, "J");
  EXCEL_COLUMNS.set(10, "K");
  EXCEL_COLUMNS.set(11, "L");
  EXCEL_COLUMNS.set(12, "M");
  EXCEL_COLUMNS.set(13, "N");
  EXCEL_COLUMNS.set(14, "O");
  EXCEL_COLUMNS.set(15, "P");
  EXCEL_COLUMNS.set(16, "Q");
  EXCEL_COLUMNS.set(17, "R");
  EXCEL_COLUMNS.set(18, "S");
  EXCEL_COLUMNS.set(19, "T");
  EXCEL_COLUMNS.set(20, "U");
  EXCEL_COLUMNS.set(21, "V");
  EXCEL_COLUMNS.set(22, "W");
  EXCEL_COLUMNS.set(23, "X");
  EXCEL_COLUMNS.set(24, "Y");
  EXCEL_COLUMNS.set(25, "Z");

  const [innerColsState, setInnerColsState] = useState(props.columns);
  const [colCode, setColCode] = useState("C");
  const [colAmount, setColAmount] = useState("F");

  const Buttons = () => {
    const btn_twstyles = "w-[100px] p-0 rounded-md py-2 text-sm hover:scale-105 active:scale-95";
    return (
      <>
        <Button
          variant="text"
          color="red"
          ripple={false}
          className={`${btn_twstyles} hover:bg-transparent active:bg-transparent`}
          onClick={() => {
            props.closeHandler();
          }}>
          đóng
        </Button>
        <Button
          variant="outlined"
          color="teal"
          className={`${btn_twstyles}`}
          onClick={() => {
            if (innerColsState !== undefined) {
              props.doneHandler(innerColsState);
            }
          }}>
          xong
        </Button>
      </>
    );
  };

  // const [defaultColumn, setDefaultColumn] = useState(new Map<number, string>());

  useEffect(() => {
    if (props.open) {
      if (props.columns !== undefined) {
        setColCode(EXCEL_COLUMNS.get(props.columns.ma_hang) ?? "C");
        setColAmount(EXCEL_COLUMNS.get(props.columns.so_luong) ?? "F");
      }
    }

    return () => {};
  }, [props.open]);

  const Body = () => {
    return (
      <div className={`w-full space-y-1.5`}>
        <div className={`flex w-full items-center`}>
          <div className={`w-1/3`}>Cột mã hàng</div>
          <div className={`w-2/3`}>
            <ArrayToSelect
              arr={Array.from(EXCEL_COLUMNS.values())}
              onChange={(value) => {
                if (innerColsState) {
                  const tmp = innerColsState;
                  tmp.ma_hang = value.charCodeAt(0) - 65;
                  setInnerColsState(tmp);
                  Common.Log(`Columns: ${JSON.stringify(tmp)}`);
                }
              }}
              default={props.columns !== undefined ? EXCEL_COLUMNS.get(props.columns.ma_hang) : ""}
              state={{ value: colCode, setValue: setColCode }}
              option_class_twstyles="font-myThin font-bold"
              select_class_twstyles="w-full focus:outline-none p-1 border-2 rounded-md border-teal-600"></ArrayToSelect>
          </div>
        </div>
        <div className={`flex w-full items-center`}>
          <div className={`w-1/3`}>Cột số lượng</div>
          <div className={`w-2/3`}>
            <ArrayToSelect
              arr={Array.from(EXCEL_COLUMNS.values())}
              onChange={(value) => {
                if (innerColsState) {
                  const tmp = innerColsState;
                  tmp.so_luong = value.charCodeAt(0) - 65;
                  setInnerColsState(tmp);
                  Common.Log(`Columns: ${JSON.stringify(tmp)}`);
                }
              }}
              default={props.columns !== undefined ? EXCEL_COLUMNS.get(props.columns.so_luong) : ""}
              state={{ value: colAmount, setValue: setColAmount }}
              option_class_twstyles="font-myThin font-bold"
              select_class_twstyles="w-full focus:outline-none p-1 border-2 rounded-md border-teal-600"></ArrayToSelect>
          </div>
        </div>
      </div>
    );
  };

  const border_width_twstyles = "border-[3px]";
  return (
    <Dialog
      open={props.open}
      handler={props.closeHandler}
      size={"xs"}
      // dismiss={{ outsidePress: false, escapeKey: true }}
      className={`select-none`}>
      <DialogHeader
        className={`p-0 py-1.5 justify-center bg-teal-50 rounded-t-md ${border_width_twstyles} border-b-0 border-teal-200`}>
        <Typography variant="lead" className={`normal-case`}>
          {"Chọn định dạng file excel"}
        </Typography>
      </DialogHeader>
      <DialogBody className={`${border_width_twstyles} border-t-0 border-b-0 border-teal-200`}>
        {Body()}
      </DialogBody>
      <DialogFooter
        className={`flex justify-end space-x-2 ${border_width_twstyles} border-t-0 border-teal-200 p-0 py-1.5 px-2 bg-teal-50 rounded-b-md`}>
        {Buttons()}
      </DialogFooter>
    </Dialog>
  );
}
