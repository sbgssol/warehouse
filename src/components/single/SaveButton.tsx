import { Button, Typography } from "@material-tailwind/react";
import { useGlobalState } from "../../types/GlobalContext";
import { dialog } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import svg_left from "../../assets/arrow-left.svg";
import svg_right from "../../assets/arrow-right.svg";
import { WarehouseData } from "../../types/ImportWarehouseData";

interface SaveButtonProps {
  className?: string;
  onClick?: () => void;
  multiple_record?: {
    records: WarehouseData.Record[];
    idx_handler: (idx: number) => void;
  };
}

export default function SaveButton(props: SaveButtonProps) {
  const { contractName } = useGlobalState();
  const handleClk = async () => {
    const response = await dialog.ask("Bạn có chắc chắn muốn lưu?", {
      type: "info",
      title: "Xác nhận",
      okLabel: "Có",
      cancelLabel: "Không"
    });
    if (response) {
      if (props.onClick) {
        props.onClick();
      }
    }
  };
  const [active, setActive] = useState(1);

  const next = () => {
    if (active === props.multiple_record?.records.length) return;
    setActive(active + 1);
  };

  const prev = () => {
    if (active === 1) return;
    setActive(active - 1);
  };

  useEffect(() => {
    if (props.multiple_record !== undefined && props.multiple_record.records.length) {
      props.multiple_record.idx_handler(active - 1);
    }

    return () => {};
  }, [active]);

  const GetSaveButtonWidth = () => {
    if (props.multiple_record !== undefined && props.multiple_record.records.length) {
      return `w-2/3`;
    }
    return `w-full`;
  };

  const Pagination = () => {
    if (props.multiple_record !== undefined && props.multiple_record.records.length) {
      return (
        <div className="w-1/3 flex justify-between items-center px-2">
          <Button
            variant="text"
            onClick={prev}
            disabled={active === 1}
            ripple={false}
            className={`${btn_twstyles}`}>
            <img src={svg_left} className={`w-[32px]`}></img>
          </Button>
          <Typography color="gray" className="font-normal">
            <strong className="text-gray-900">{active}</strong> trên{" "}
            <strong className="text-gray-900">{props.multiple_record.records.length}</strong>
          </Typography>
          <Button
            variant="text"
            onClick={next}
            ripple={false}
            disabled={active === props.multiple_record.records.length}
            className={`${btn_twstyles}`}>
            <img src={svg_right} className={`w-[32px]`}></img>
          </Button>
        </div>
      );
    }
    return <></>;
  };

  const SaveButtonName = () => {
    if (props.multiple_record !== undefined && props.multiple_record.records.length) {
      return "lưu tất cả";
    }
    return "lưu";
  };

  const btn_twstyles =
    "hover:bg-transparent p-0 hover:scale-105 active:bg-transparent active:scale-90";
  return (
    <div className={`w-full mt-2 flex justify-center select-none`}>
      {Pagination()}
      <Button
        variant="text"
        className={`${props.className} p-1 ${GetSaveButtonWidth()} border-2 hover:-translate-y-0.5`}
        onClick={handleClk}
        disabled={!contractName.length}>
        <p className="text-xl font-myRegular uppercase">{SaveButtonName()}</p>
      </Button>
    </div>
  );
}
