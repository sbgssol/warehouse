import { Dialog, Typography, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { useState } from "react";
import icon_info from "../../assets/info.svg";
import icon_warn from "../../assets/warning.svg";
import icon_erro from "../../assets/error.svg";

type Type = "info" | "warning" | "error";

interface Props {
  message: string;
  type?: Type;
}

export default function Popup(props: Props) {
  const { type = "info", message } = props;
  const [propsType, setPropsType] = useState(type);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(false);
  };

  const SelectIcon = () => {
    if (propsType === "error") {
      return <img width={48} src={icon_erro} alt="" />;
    }
    if (propsType === "warning") {
      return <img width={48} src={icon_warn} alt="" />;
    }
    return <img width={48} src={icon_info} alt="" />;
  };

  const SelectButtons = () => {
    const className = "w-[100px] p-2 rounded-md";
    if (propsType === "error") {
      return (
        <>
          <Button color="red" className={`${className}`}>
            Error
          </Button>
        </>
      );
    }
    if (propsType === "warning") {
      return (
        <>
          <Button color="orange" className={`${className}`}>
            Error
          </Button>
        </>
      );
    }
    return (
      <>
        <Button color="blue" className={`${className}`}>
          OK
        </Button>
      </>
    );
  };

  const SelectDialogBorder = () => {
    let className = "border-4 border-teal-500";
    if (propsType === "error") {
      className = "border-4 border-red-500";
    }
    if (propsType === "warning") {
      className = "border-4 border-orange-500";
    }
    return className;
  };

  const Message = () => {
    return <Typography variant="paragraph">{message}</Typography>;
  };

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}>
        Click
      </Button>
      <Dialog
        open={open}
        handler={handleOpen}
        size="xs"
        dismiss={{ escapeKey: false, outsidePress: false }}
        className={`${SelectDialogBorder()} select-none`}>
        <DialogBody>
          {SelectIcon()}
          {SelectButtons()}
          {Message()}
        </DialogBody>
        <DialogFooter className="space-x-2">
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
        </DialogFooter>
      </Dialog>
    </>
  );
}
