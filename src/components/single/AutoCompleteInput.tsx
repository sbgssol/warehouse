import { ChangeEvent, ReactNode, useState } from "react";
import { Common } from "../../types/GlobalFnc";
import { Button, List, ListItem } from "@material-tailwind/react";
import svg_close from "../../assets/close.svg";

interface AutoCompleteInputProps {
  data_source: string[];
  label?: string | ReactNode;
  div_wrapper_class_twstyes?: string;
  input_class_twstyles?: string;
  list_class_twstyles?: string;
  list_item_class_twstyles?: string;
  item_selected_handler?: (value: string) => void;
}
export default function AutoCompleteInput(props: AutoCompleteInputProps) {
  const [matchSources, setMatchSources] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const new_value = e.target.value;
    if (new_value.length) {
      const tmp: string[] = [];
      for (let i = 0; i < props.data_source.length; ++i) {
        const value = props.data_source[i];
        if (value.toUpperCase().includes(new_value.toUpperCase())) {
          tmp.push(value);
        }
        // if (tmp.length > 7) {
        //   break;
        // }
      }
      setMatchSources(tmp);
    } else {
      setMatchSources([]);
    }
    setInputValue(e.target.value);
    Common.Log(`Input changed: ${e.target.value}`);
  };

  const CreateList = () => {
    if (matchSources.length == 0) {
      return <></>;
    }
    return (
      <List
        className={`absolute mt-0.5 left-0 p-0 h-[300px] overflow-auto ${props.list_class_twstyles}`}>
        {matchSources.map((value, idx) => {
          return (
            <ListItem
              className={`p-0 rounded-none ${props.list_item_class_twstyles}`}
              key={idx}
              onClick={() => {
                setInputValue(value);
                if (props.item_selected_handler !== undefined) {
                  props.item_selected_handler(value);
                }
                setMatchSources([]);
              }}>
              {value}
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <>
      {props.label}
      <div className={`relative ${props.div_wrapper_class_twstyes}`}>
        <div className={`relative`}>
          <input
            placeholder="Nhập mã sản phẩm"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className={`${props.input_class_twstyles}`}
          />
          <Button
            className={`p-0 absolute right-0 mr-0.5 mt-1 hover:bg-transparent active:bg-transparent hover:scale-105 active:scale-90`}
            ripple={false}
            variant="text"
            onClick={() => {
              setInputValue("");
              setMatchSources([]);
            }}>
            <img src={svg_close} className={`w-[28px]`} />{" "}
          </Button>
        </div>
        {CreateList()}
      </div>
    </>
  );
}
