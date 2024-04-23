import {
  Button,
  Dialog,
  DialogBody,
  Typography,
} from "@material-tailwind/react";
import CsvToSelect from "./CsvToSelect";
import GlobalStrings from "../types/Globals";
import { size } from "@material-tailwind/react/types/components/dialog";

export default function SelectContract(props: {
  open: boolean;
  handler: () => void;
  onChange: (value: string) => void;
  onOkay: () => void;
  size?: size;
}) {
  return (
    <Dialog
      open={props.open}
      handler={props.handler}
      dismiss={{ outsidePress: false, escapeKey: true }}
      size={props.size}
    >
      <DialogBody>
        <div className="w-full flex flex-col items-center">
          <div className="w-max flex flex-col items-center">
            <Typography variant="h2" className="mb-1">
              Chọn hợp đồng
            </Typography>
            <CsvToSelect
              file_name={GlobalStrings.ContractFileName}
              onChange={props.onChange}
              label="Chọn mã hợp đồng"
              select_class="w-full p-2 text-pink-300"
              option_class="text-pink-200"
            ></CsvToSelect>
            <Button
              className="mt-1"
              fullWidth
              onClick={props.onOkay}
              color="pink"
            >
              OK
            </Button>
          </div>
          <p className=""></p>
        </div>
      </DialogBody>
    </Dialog>
  );
}
