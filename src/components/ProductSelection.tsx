import {
  Dialog,
  DialogHeader,
  DialogBody,
  List,
  ListItem,
  ListItemPrefix,
  Checkbox,
  Typography,
  DialogFooter,
  Button
} from "@material-tailwind/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export default function ProductSelection(props: {
  open: boolean;
  closeHandler: (close: boolean) => void;
  codeList: string[];
  selectedCode: string[];
  productMap: Map<string, { name: string; unit: string }>;
  handleCodeChange: (strings: string[]) => void;
}) {
  const checkboxRef = useRef<HTMLInputElement[]>([]);
  const selectedCode = new Set<string>(props.selectedCode);
  const [selectionOrder, setSelectionOrder] = useState<number[]>([]);

  const handleModalReset = () => {
    props.handleCodeChange([]);
    if (checkboxRef.current) {
      checkboxRef.current.forEach((value) => {
        value.checked = false;
      });
    }
    setSelectionOrder(new Array(props.codeList.length).fill(0));
  };
  const handleModalClose = () => {
    props.closeHandler(false);
  };
  const handleModalClear = () => {
    // Clear all checked codes
    if (checkboxRef.current) {
      checkboxRef.current.forEach((value) => {
        value.checked = false;
      });
    }
    setSelectionOrder(new Array(props.codeList.length).fill(0));
  };
  const handleModalDone = () => {
    if (checkboxRef.current) {
      // Collect selected codes
      const map = new Map<number, string>();
      for (let i = 0; i < props.codeList.length; ++i) {
        if (selectionOrder[i] != 0 && checkboxRef.current[i].checked) {
          map.set(selectionOrder[i], props.codeList[i]);
          console.log(`${props.codeList[i]} -> ${selectionOrder[i]}`);
        }
      }

      const selected: string[] = [];
      const sorted = new Map([...map.entries()].sort());
      sorted.forEach((value) => {
        selected.push(value);
      });

      props.handleCodeChange(selected);
    }
    props.closeHandler(false);
  };

  useEffect(() => {
    setSelectionOrder(new Array(props.codeList.length).fill(0));
  }, [props.codeList]);

  const getProductName = (code: string) => {
    let name = "-";
    const tmp = props.productMap.get(code);
    if (tmp) {
      name = tmp.name;
    }
    return name;
  };

  return (
    <Dialog
      open={props.open}
      handler={props.closeHandler}
      dismiss={{ outsidePress: false, escapeKey: true }}>
      <DialogHeader>Chọn mã hàng cần nhập</DialogHeader>
      <DialogBody className="h-[70vh] overflow-y-scroll">
        <List className="border-2 rounded-md">
          {props.codeList.map((value, index) => (
            <ListItem
              className="p-0 border-b rounded-none overflow-hidden"
              key={index}
              ripple={false}>
              <label className="flex w-full cursor-pointer items-center px-2 ">
                <ListItemPrefix className="mr-1 w-5">
                  <span className="font-bold text-green-500">
                    {selectionOrder[index] == 0 ? "" : selectionOrder[index]}
                  </span>
                </ListItemPrefix>
                <ListItemPrefix className="mr-3">
                  <Checkbox
                    color="green"
                    className="hover:before:opacity-0 rounded-full"
                    containerProps={{
                      className: "p-0"
                    }}
                    inputRef={(ref) => {
                      if (ref) {
                        checkboxRef.current[index] = ref;
                        console.log("Ref assigned successfully!");
                      }
                    }}
                    defaultChecked={selectedCode.has(value)}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const checked = event.target.checked;
                      if (checked) {
                        setSelectionOrder((prevSelectionOrder) => {
                          const newSelectionOrder = [...prevSelectionOrder];
                          const checkedIndex =
                            newSelectionOrder.filter((order) => order > 0).length + 1;
                          newSelectionOrder[index] = checkedIndex;
                          return newSelectionOrder;
                        });
                      } else {
                        setSelectionOrder((prevSelectionOrder) => {
                          const newSelectionOrder = [...prevSelectionOrder];
                          const uncheckedOrder = newSelectionOrder[index];
                          newSelectionOrder[index] = 0;
                          newSelectionOrder.forEach((order, i) => {
                            if (order > uncheckedOrder) {
                              newSelectionOrder[i] = order - 1;
                            }
                          });
                          return newSelectionOrder;
                        });
                      }
                    }}
                  />
                </ListItemPrefix>
                <div>
                  <Typography color="pink" className="font-medium" variant="paragraph">
                    {value}
                  </Typography>
                  <Typography color="gray" className="font-medium" variant="small">
                    {getProductName(value)}
                  </Typography>
                </div>
              </label>
            </ListItem>
          ))}
        </List>
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button
          variant="filled"
          color="red"
          onClick={handleModalClose}
          className={`w-[130px] h-[40px] flex items-center justify-center`}>
          Đóng
        </Button>
        <Button
          variant="outlined"
          color="red"
          onClick={handleModalReset}
          className={`w-[130px] h-[40px]`}>
          Đặt lại
        </Button>
        <Button
          variant="outlined"
          color="orange"
          onClick={handleModalClear}
          className={`w-[130px] h-[40px]`}>
          Xóa
        </Button>
        <Button
          variant="gradient"
          color="green"
          onClick={handleModalDone}
          className="w-[150px] h-[40px]">
          Xong
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
