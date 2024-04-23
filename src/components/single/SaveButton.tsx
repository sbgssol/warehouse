import { Button } from "@material-tailwind/react";
import { useGlobalState } from "../../types/GlobalContext";
import { dialog } from "@tauri-apps/api";

export default function SaveButton(props: {
  className?: string;
  onClick?: () => void;
}) {
  const { contractName } = useGlobalState();
  const handleClk = async () => {
    const response = await dialog.ask("Bạn có chắc chắn muốn lưu?", {
      type: "info",
      title: "Xác nhận",
      okLabel: "Có",
      cancelLabel: "Không",
    });
    if (response) {
      if (props.onClick) {
        props.onClick();
      }
    }
  };
  return (
    <div className={`absolute bottom-1 w-[98%]`}>
      <Button
        className={`${props.className} p-1.5 w-full`}
        onClick={handleClk}
        disabled={!contractName.length}
      >
        <p className="text-xl font-normal normal-case">Lưu</p>
      </Button>
    </div>
  );
}
