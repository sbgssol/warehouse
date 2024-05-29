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

interface ExcelFormatSelectProps {
  open: boolean;
  closeHandler: () => void;
  doneHandler: () => void;
}

export type ExcelColumnPosition = {
  ma_hang: number;
  so_luong: number;
};

export default function ExcelFormatSelect(props: ExcelFormatSelectProps) {
  const COL_Code = 2;
  const COL_Amount = 5;

  const Buttons = () => {
    const btn_twstyles = "w-[100px] p-0 rounded-md py-2 text-sm";
    return (
      <>
        <Button
          variant="text"
          color="deep-orange"
          className={`${btn_twstyles} `}
          onClick={() => {
            props.closeHandler();
          }}>
          đóng
        </Button>
        <Button
          variant="gradient"
          color="light-green"
          className={`${btn_twstyles}`}
          onClick={() => {
            // props.doneHandler(Array.from(selectedEntries.keys()));
          }}>
          xong
        </Button>
      </>
    );
  };

  // const [defaultColumn, setDefaultColumn] = useState(new Map<number, string>());
  const ColMap = new Map<number, string>([
    [0, "A"],
    [1, "B"],
    [2, "C"],
    [3, "D"],
    [4, "E"],
    [5, "F"],
    [6, "G"],
    [7, "H"],
    [8, "I"],
    [9, "J"],
    [10, "K"],
    [11, "L"],
    [12, "M"],
    [13, "N"],
    [14, "O"],
    [15, "P"],
    [16, "Q"],
    [17, "R"],
    [18, "S"],
    [19, "T"],
    [20, "U"],
    [21, "V"],
    [22, "W"],
    [23, "X"],
    [24, "Y"],
    [25, "Z"]
  ]);
  const [colCode, setColCode] = useState("C");
  const [colAmount, setColAmount] = useState("F");

  useEffect(() => {
    if (props.open) {
      setColCode(ColMap.get(COL_Code) ?? "C");
      setColAmount(ColMap.get(COL_Amount) ?? "F");
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
              arr={Array.from(ColMap.values())}
              onChange={() => {}}
              default={ColMap.get(COL_Code)}
              state={{ value: colCode, setValue: setColCode }}
              option_class_twstyles="font-myThin font-bold"
              select_class_twstyles="w-full focus:outline-none p-1 border-2 rounded-md border-teal-600"></ArrayToSelect>
          </div>
        </div>
        <div className={`flex w-full items-center`}>
          <div className={`w-1/3`}>Cột số lượng</div>
          <div className={`w-2/3`}>
            <ArrayToSelect
              arr={Array.from(ColMap.values())}
              onChange={() => {}}
              default={ColMap.get(COL_Amount)}
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
        className={`p-0 py-1.5 justify-center bg-green-50 rounded-t-md ${border_width_twstyles} border-b-0 border-green-200`}>
        <Typography variant="lead" className={`normal-case`}>
          {"Chọn định dạng file excel"}
        </Typography>
      </DialogHeader>
      <DialogBody className={`${border_width_twstyles} border-t-0 border-b-0 border-green-200`}>
        {Body()}
      </DialogBody>
      <DialogFooter
        className={`flex justify-end space-x-2 ${border_width_twstyles} border-t-0 border-green-200 p-0 py-1.5 px-2 bg-green-50 rounded-b-md`}>
        {Buttons()}
      </DialogFooter>
    </Dialog>
  );
}
