import { ChangeEvent, RefObject, useEffect, useState } from "react";
import { ReadCsvToStrArr } from "../types/ReadCsv";

export default function CsvToSelect(props: {
  file_name: string;
  onChange: (value: string) => void;
  select_class?: string;
  option_class?: string;
  label: string;
}) {
  const [data, setData] = useState<string[]>([]);
  const onLoad = async () => {
    let tmp = await ReadCsvToStrArr(props.file_name);
    setData(tmp);
  };

  useEffect(() => {
    onLoad();
    return () => {};
  }, []);

  return (
    <select className={props.select_class} onChange={(e: ChangeEvent<HTMLSelectElement>) => props.onChange(e.target.value)} defaultValue={""}>
      {props.label ? (
        <option value="" disabled className={props.option_class}>
          {props.label}
        </option>
      ) : (
        <></>
      )}
      {data.map((str, index) => (
        <option key={index} className={props.option_class}>
          {str}
        </option>
      ))}
    </select>
  );
}
