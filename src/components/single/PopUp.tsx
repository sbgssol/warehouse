import { Dialog, Button } from "@material-tailwind/react";
import icon_info from "../../assets/info.svg";
import icon_warn from "../../assets/warning.svg";
import icon_erro from "../../assets/error.svg";
import { useGlobalState } from "../../types/GlobalContext";

export type PopupType = "info" | "warning" | "error";

export default function Popup() {
  const { popup } = useGlobalState();

  const handleOpen = () => {
    popup.setOpen(false);
  };

  const SelectIcon = () => {
    if (popup.type === "error") {
      return <img width={48} src={icon_erro} alt="" />;
    }
    if (popup.type === "warning") {
      return <img width={48} src={icon_warn} alt="" />;
    }
    return <img width={48} src={icon_info} alt="" />;
  };

  const SelectButtons = () => {
    const className = "w-[100px] p-2 rounded-md";
    if (popup.type === "error") {
      return (
        <>
          <Button
            color="red"
            className={`${className}`}
            onClick={() => {
              popup.setOpen(false);
            }}>
            đóng
          </Button>
        </>
      );
    }
    if (popup.type === "warning") {
      return (
        <>
          <Button
            color="orange"
            className={`${className}`}
            onClick={() => {
              popup.setAnswer(false);
              popup.setOpen(false);
            }}>
            không
          </Button>
          <Button
            color="orange"
            variant="outlined"
            className={`${className}`}
            onClick={() => {
              popup.setAnswer(true);
              popup.setOpen(false);
            }}>
            có
          </Button>
        </>
      );
    }
    return (
      <>
        <Button color="teal" className={`${className}`} onClick={() => popup.setOpen(false)}>
          OK
        </Button>
      </>
    );
  };

  const WrapButtons = () => {
    return <div className="w-full flex justify-end space-x-2 pt-1">{SelectButtons()}</div>;
  };

  const SelectDialogBorder = () => {
    let className = "border-4 border-teal-500";
    if (popup.type === "error") {
      className = "border-4 border-red-500";
    }
    if (popup.type === "warning") {
      className = "border-4 border-orange-500";
    }
    return className;
  };

  const Message = () => {
    return <div className="pl-2">{popup.message}</div>;
  };

  const DismissForError = () => {
    if (popup.type == "error" || popup.type == "warning") {
      return { escapeKey: false, outsidePress: false };
    }
    return {};
  };

  return (
    <>
      <Dialog
        open={popup.open}
        handler={handleOpen}
        size="xs"
        dismiss={DismissForError()}
        className={`${SelectDialogBorder()} select-none p-4 pb-2`}>
        <div className="flex items-center border-b-2 pb-2 mb-2">
          {SelectIcon()}
          {Message()}
        </div>
        {WrapButtons()}
        {/* <DialogFooter className="space-x-2">
          <Button
            onClick={() => {
              setPropsType("info");
            }}>
            info
          </Button>
          <Button
            onClick={() => {
              setPropsType("warning");
            }}>
            warning
          </Button>
          <Button
            onClick={() => {
              setPropsType("error");
            }}>
            error
          </Button>
        </DialogFooter> */}
      </Dialog>
    </>
  );
}
