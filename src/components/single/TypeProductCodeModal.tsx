import { Button, Dialog, DialogFooter, Typography } from "@material-tailwind/react";
import { useGlobalState } from "../../types/GlobalContext";
import cancel_icon from "../../assets/modify-cancel.svg";
import save_icon from "../../assets/modify-accept.svg";
import { useRef, useState } from "react";

interface TypeProductCodeProps {
  saveHandler?: (codes: string[], amount?: number[]) => void;
}

export default function TypeProductCodeModal(props: TypeProductCodeProps) {
  const { input_code } = useGlobalState();
  const [codeList, setCodeList] = useState<string>("");
  const [amountList, setAmountList] = useState<string>("");
  const codeListRef = useRef<HTMLTextAreaElement>(null);
  const amountListRef = useRef<HTMLTextAreaElement>(null);
  const lineNumberRef = useRef<HTMLTextAreaElement>(null);

  const btn_width_twstyles = "max-w-[150px]";
  const CancelButton = () => {
    return (
      <Button
        variant="text"
        color="deep-orange"
        className={`${btn_width_twstyles} flex items-center justify-evenly py-1 px-1 border-2 border-deep-orange-400`}
        onClick={() => {
          input_code.setOpen(false);
        }}>
        <img src={cancel_icon} className="w-[32px]"></img>
      </Button>
    );
  };
  const splitList = (list: string) => {
    let tmp = [""];
    if (list.indexOf("\r\n") >= 0) {
      tmp = list.split("\r\n");
    } else {
      tmp = list.split("\n");
    }
    return tmp;
  };
  const convertCodeList = () => {
    let data: string[] = [];
    splitList(codeList).forEach((str) => {
      // console.log(`Convert Code List: ${str} -> ${str.trim().length}`);
      if (str.trim().length > 0) {
        data.push(str);
      }
    });
    // console.log(`Convert Code List:\n${JSON.stringify(data)}`);

    return data;
  };
  const convertAmountList = () => {
    let data: number[] = [];
    splitList(amountList).forEach((str) => {
      // console.log(`Convert Amount List: ${str} -> ${Number(str.trim())}`);
      if (Number(str.trim()) > 0) {
        data.push(Number(str.trim()));
      }
    });
    // console.log(`Convert Amount List:\n${JSON.stringify(data)}`);
    return data;
  };

  const handleSaveClick = () => {
    if (props.saveHandler !== undefined) {
      props.saveHandler(convertCodeList(), convertAmountList());
    }
  };

  const SaveButton = () => {
    return (
      <Button
        variant="text"
        color="green"
        className={`${btn_width_twstyles} flex items-center justify-evenly py-1 px-1 border-2 border-green-400`}
        onClick={handleSaveClick}>
        <img src={save_icon} className="w-[32px]"></img>
      </Button>
    );
  };

  const Buttons = () => {
    return (
      <div className={`w-full flex items-center justify-center space-x-3`}>
        {CancelButton()}
        {SaveButton()}
        {/* <div className={`w-1/3`}>{CancelButton()}</div>
        <div className={`w-2/3 flex justify-end space-x-2`}>{SaveButton()}</div> */}
      </div>
    );
  };

  const handleCodeListScroll = () => {
    if (codeListRef.current && lineNumberRef.current && amountListRef.current) {
      lineNumberRef.current.scrollTop = codeListRef.current.scrollTop;
      amountListRef.current.scrollTop = codeListRef.current.scrollTop;
    }
  };

  const handleCodeListChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setCodeList(text);
  };

  const handleAmountListChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setAmountList(text);
  };

  const Body = () => {
    const place_holder =
      "Nhập mã hàng vào đây, mỗi mã hàng nằm trên một dòng.\
 Số lượng (nếu có) được nhập ở cột bên cạnh";
    return (
      <div className={`w-full `}>
        <Typography
          variant="h5"
          className={`text-center mt-1 border-b-2 font-myRegular capitalize`}>
          nhập mã hàng
        </Typography>
        <div className={`w-full p-1`} style={{ display: "flex" }}>
          <textarea
            name="line-number"
            id="line-number"
            className={`resize-none w-[10%] p-1 focus:outline-none h-[60svh] bg-gray-100 text-right font-myRegular text-gray-500 overflow-hidden`}
            readOnly
            ref={lineNumberRef}
            value={codeList
              .split("\n")
              .map((_, index) => index + 1)
              .join("\n")}></textarea>
          <textarea
            name="code-list"
            id="code-list"
            className={`resize-none w-[70%] p-1 focus:outline-none h-[60svh] bg-gray-50 font-myThin font-bold border-r-2`}
            placeholder={place_holder}
            onChange={handleCodeListChange}
            // onKeyDown={handleKeyDown}
            onScroll={handleCodeListScroll}
            value={codeList}
            ref={codeListRef}></textarea>
          <textarea
            name="amount-list"
            id="amount-list"
            placeholder="Số lượng"
            className={`resize-none w-[20%] p-1 focus:outline-none h-[60svh] bg-gray-50 font-myThin font-bold overflow-hidden`}
            onChange={handleAmountListChange}
            value={amountList}
            ref={amountListRef}></textarea>
        </div>
      </div>
    );
  };

  return (
    <Dialog
      open={input_code.open}
      handler={() => {
        input_code.setOpen(false);
      }}
      size="sm">
      {Body()}
      <DialogFooter className={`px-2 border-t-2 mt-1.5`}>{Buttons()}</DialogFooter>
    </Dialog>
  );
}
