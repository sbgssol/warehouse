import { Button, Typography } from "@material-tailwind/react";
import CsvToSelect from "./CsvToSelect";
import { RefObject, useRef, useState } from "react";
import GlobalStrings from "../types/Globals";
import { NavbarDefault } from "./Navbar";
import { useGlobalState } from "../types/GlobalContext";

export default function SelectContract() {
  const [contract, setContract] = useState("");

  const { setContractName } = useGlobalState();

  const handleHdChanged = (hd: string) => {
    setContract(hd);
    setContractName(hd);
  };
  return (
    <>
      <NavbarDefault></NavbarDefault>
      <div className="w-full flex flex-col items-center">
        <div className="w-max bg-lime-100 flex flex-col items-center">
          <Typography variant="h2" className="mb-1">
            Chọn hợp đồng
          </Typography>
          <CsvToSelect file_name={GlobalStrings.ContractFileName} onChange={handleHdChanged} label="Chọn mã hợp đồng" select_class="w-full p-2"></CsvToSelect>
          <Button className="mt-1" fullWidth>
            OK
          </Button>
        </div>
        <p className=""></p>
      </div>
    </>
  );
}
