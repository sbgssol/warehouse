import { Dialog, Typography, DialogBody, Button } from "@material-tailwind/react";
import { ChangeEvent, useEffect, useState } from "react";

interface Props {
  open: boolean;
  product_code: string;
  product_name: string;
  closeHandler: () => void;
  okHandler: (amount: number) => void;
}

export default function InputStock(props: Props) {
  const [amount, setAmount] = useState(0);
  const handleOk = () => {
    props.okHandler(amount);
  };

  useEffect(() => {
    if (props.open) {
      setAmount(0);
    }

    return () => {};
  }, [props.open]);

  return (
    <>
      <Dialog
        open={props.open}
        handler={props.closeHandler}
        size="xs"
        // dismiss={{ escapeKey: false, outsidePress: false }}
        className={`select-none`}>
        <DialogBody>
          Nhập số lượng <span className="font-bold ">tồn đầu kì</span> cho:
          <Typography variant="lead" color="black" className="font-bold">
            {props.product_code}
          </Typography>
          <Typography variant="paragraph" color="black" className="font-bold">
            {props.product_name}
          </Typography>
          <input
            type="number"
            className="w-full border-2 border-blue-gray-500 focus:outline-blue-gray-500 pl-2 rounded-md text-xl font-bold text-green-700"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if ((e.target.value as unknown as number) < 0) {
                e.target.value = "0";
              }
              setAmount(Number(e.target.value));
            }}
          />
          <div className="w-full pt-2 space-x-2 flex justify-end">
            <Button color="red" variant="outlined" onClick={props.closeHandler}>
              hủy
            </Button>
            <Button color="green" variant="gradient" onClick={handleOk} disabled={amount <= 0}>
              lưu
            </Button>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
}
