import { ChangeEvent, useEffect, useRef, useState } from "react";

export default function ArrayToSelect(props: {
  arr: string[];
  onChange: (value: string) => void;
  remain_old_choice?: boolean;
  how_many_columns?: number;
  target_column?: number;
  select_class?: string;
  option_class?: string;
  default?: string;
  label?: string;
  has_header?: boolean;
  disabled?: boolean;
}) {
  const [data, setData] = useState<string[]>([]);
  const selectRef = useRef<HTMLSelectElement>(null);

  const onLoad = async () => {
    let tmp = props.arr;

    if (props.how_many_columns !== undefined && props.how_many_columns !== undefined) {
    } else if (props.target_column !== undefined) {
      let t = tmp.slice(0, 0);
      tmp.forEach((v) => {
        t.push(v.split(",")[props.target_column ?? 0]);
      });
      tmp = t;
    } else if (props.how_many_columns !== undefined) {
      let t = tmp.slice(0, 0);
      tmp.forEach((v) => {
        const arr = v.split(",");
        t.push(arr.slice(0, props.how_many_columns).join());
        // console.log("t: ", t);
      });
      tmp = t;
    }
    if (props.has_header) {
      const t = tmp.slice(1);
      tmp = t;
    }
    setData(tmp);
  };

  useEffect(() => {
    onLoad();
    if (props.remain_old_choice === undefined || !props.remain_old_choice) {
      props.onChange(props.arr[0]);
      if (selectRef && selectRef.current) {
        selectRef.current.value = props.arr[0];
      }
    }
    // console.log(`Default value: ${props.default}`);

    return () => {};
  }, [props.arr, props.how_many_columns, props.target_column]);

  return (
    <select
      disabled={props.disabled}
      className={props.select_class}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => props.onChange(e.target.value)}
      value={props.default}
      ref={selectRef}>
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
