import { Typography } from "@material-tailwind/react";
import icon_wait from "../../assets/loading.svg";

interface PleaseWaitProps {
  label?: string;
}

export default function PleaseWait(props?: PleaseWaitProps) {
  return (
    <div className={`w-full h-full flex flex-col justify-center items-center select-none`}>
      <Typography variant="lead" className={`normal-case`}>
        {props?.label ?? ""}
      </Typography>
      <img src={icon_wait} className={`w-[15%] animate-spin overflow-hidden`} />
    </div>
  );
}
