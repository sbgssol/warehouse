import { ChangeEvent, useEffect, useState } from "react";
import { ReadCsvToStrArr } from "../types/ReadCsv";

export default function CsvToSelect(props: {
  file_name: string;
  onChange: (value: string) => void;
  select_class?: string;
  option_class?: string;
  default?: string;
  label: string;
}) {
  const [data, setData] = useState<string[]>([]);
  const onLoad = async () => {
    const tmp = await ReadCsvToStrArr(props.file_name);
    setData(tmp);
  };

  useEffect(() => {
    onLoad();
    console.log(`Default value: ${props.default}`);

    return () => {};
  }, [props.file_name]);

  return (
    <select
      className={props.select_class}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => props.onChange(e.target.value)}
      value={props.default}
    >
      {props.label ? (
        <option value="" disabled className={props.option_class}>
          {props.label}
        </option>
      ) : (
        <></>
      )}
      {data.map((str, index) => (
        <option key={index} className={props.option_class} value={str}>
          {str}
        </option>
      ))}
    </select>
  );
}
