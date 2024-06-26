import { ChangeEvent, useEffect, useRef, useState } from "react";

type ArrayToSelectState = {
  value: string;
  setValue: (value: string) => void;
};

export default function ArrayToSelect(props: {
  arr: string[];
  onChange: (value: string) => void;
  remain_old_choice?: boolean;
  how_many_columns?: number;
  target_column?: number;
  select_class_twstyles?: string;
  option_class_twstyles?: string;
  default?: string;
  label?: string;
  has_header?: boolean;
  disabled?: boolean;
  state?: ArrayToSelectState;
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
      const s = new Set(props.arr);
      const value =
        props.state !== undefined && props.state.value.length && s.has(props.state.value)
          ? props.state.value
          : props.arr[0];
      if (selectRef && selectRef.current) {
        selectRef.current.value = value;
      }
      props.onChange(value);
    }
    // console.log(`Default value: ${props.default}`);

    return () => {};
  }, [props.arr, props.how_many_columns, props.target_column]);

  return (
    <select
      disabled={props.disabled}
      className={`${props.select_class_twstyles}`}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
        if (props.state !== undefined) {
          props.state.setValue(e.target.value);
        }
        props.onChange(e.target.value);
      }}
      value={props.state !== undefined ? props.state.value : props.default}
      ref={selectRef}>
      {props.label ? (
        <option value="" disabled className={props.option_class_twstyles}>
          {props.label}
        </option>
      ) : (
        <></>
      )}
      {data.map((str, index) => (
        <option key={index} className={`${props.option_class_twstyles} `} value={str}>
          {str}
        </option>
      ))}
    </select>
  );
}
