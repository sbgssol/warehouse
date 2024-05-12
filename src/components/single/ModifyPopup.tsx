import { Dialog, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { useGlobalState } from "../../types/GlobalContext";
import cancel_icon from "../../assets/modify-cancel.svg";
import delete_icon from "../../assets/modify-delete.svg";
import save_icon from "../../assets/modify-accept.svg";
import { ReactNode } from "react";

interface ModifyProps {
  label?: string | ReactNode;
  deleteHandler?: () => void;
  saveHandler?: () => void;
  children?: ReactNode | ReactNode[];
}

export default function ModifyPopup(props?: ModifyProps) {
  const { modify } = useGlobalState();

  const btn_width_twstyles = "max-w-[150px] w-[100px]";
  const CancelButton = () => {
    return (
      <Button
        variant="text"
        color="deep-orange"
        className={`${btn_width_twstyles} flex items-center justify-evenly py-1 px-1 border-2 border-deep-orange-400`}
        onClick={() => {
          modify.setOpen(false);
        }}>
        hủy <img src={cancel_icon} className="w-[32px]"></img>
      </Button>
    );
  };

  const SaveButton = () => {
    return (
      <Button
        variant="text"
        color="green"
        className={`${btn_width_twstyles} flex items-center justify-evenly py-1 px-1 border-2 border-green-400`}
        onClick={props?.saveHandler}>
        lưu <img src={save_icon} className="w-[32px]"></img>
      </Button>
    );
  };

  const DeleteButton = () => {
    return (
      <Button
        variant="text"
        color="red"
        className={`${btn_width_twstyles} flex items-center justify-evenly py-1 px-1 border-2 border-red-400`}
        onClick={props?.deleteHandler}>
        xóa <img src={delete_icon} className="w-[32px]"></img>
      </Button>
    );
  };

  const Buttons = () => {
    if (modify.type == "edit") {
      <div>
        {CancelButton()}
        {SaveButton()}
      </div>;
    } else if (modify.type == "delete") {
      <div>
        {CancelButton()}
        {DeleteButton()}
      </div>;
    } else if (modify.type == "default") {
      return (
        <div className={`w-full flex items-center`}>
          <div className={`w-1/3`}>{CancelButton()}</div>
          <div className={`w-2/3 flex justify-end space-x-2`}>
            {DeleteButton()}
            {SaveButton()}
          </div>
        </div>
      );
    }
    return <Button>ok</Button>;
  };

  const Body = () => {
    return (
      <div className={`flex flex-col items-center mt-2 w-full`}>
        {typeof props?.label == "string" ? (
          <Typography variant="h4" className={`uppercase border-b-2 w-full text-center mb-1.5`}>
            {props?.label}
          </Typography>
        ) : (
          <div>{props?.label}</div>
        )}
        {props?.children}
      </div>
    );
  };

  return (
    <Dialog
      open={modify.open}
      handler={() => {
        modify.setOpen(false);
      }}
      size="sm">
      {Body()}
      <DialogFooter className={`px-2 border-t-2 mt-1.5`}>{Buttons()}</DialogFooter>
    </Dialog>
  );
}
