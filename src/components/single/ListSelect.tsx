import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  List,
  ListItem,
  ListItemPrefix,
  Typography
} from "@material-tailwind/react";
import { size } from "@material-tailwind/react/types/components/dialog";
import { useEffect, useState } from "react";
import { Common } from "../../types/GlobalFnc";

interface ListSelectProps {
  open: boolean;
  closeHandler: () => void;
  doneHandler: (selected: string[]) => void;
  items: string[];
  label?: string;
  label_twstyles?: string;
  list_twstyles?: string;
  list_item_twstyles?: string;
  item_label_twstyles?: string;
  body_twstyles?: string;
  size?: size;
}

export default function ListSelect(props: ListSelectProps) {
  const [selectedEntries, setSelectedEntries] = useState(new Map<string, number>());

  useEffect(() => {
    setSelectedEntries(new Map<string, number>());
    Common.Log(`items: ${props.items}`);
    return () => {};
  }, [props.items]);

  const Buttons = () => {
    const btn_twstyles = "w-[100px] p-0 rounded-md py-2 text-sm";
    return (
      <>
        <Button
          variant="outlined"
          color="red"
          className={`${btn_twstyles} hover:bg-red-50`}
          onClick={() => {
            props.closeHandler();
          }}>
          đóng
        </Button>
        <Button
          variant="gradient"
          color="light-green"
          className={`${btn_twstyles}`}
          onClick={() => {
            props.doneHandler(Array.from(selectedEntries.keys()));
          }}>
          xong
        </Button>
      </>
    );
  };

  return (
    <Dialog
      open={props.open}
      handler={props.closeHandler}
      size={props.size}
      // dismiss={{ outsidePress: false, escapeKey: true }}
      className="select-none">
      <DialogHeader className={`${props.label_twstyles} mx-2`}>{props.label ?? ""}</DialogHeader>
      <DialogBody className={`${props.body_twstyles}`}>
        <List className={`${props.list_twstyles}`}>
          {props.items.map((value, index) => (
            <ListItem className={`${props.list_item_twstyles}`} key={index} ripple={false}>
              <label className={`${props.item_label_twstyles}`}>
                <ListItemPrefix className="mr-1">
                  <Checkbox
                    color="green"
                    className={`hover:before:opacity-0`}
                    checked={selectedEntries.has(value)}
                    onChange={(e) => {
                      const tmp = new Map(selectedEntries);
                      if (e.target.checked) {
                        tmp.set(value, index);
                      } else {
                        tmp.delete(value);
                      }
                      setSelectedEntries(tmp);
                    }}
                  />
                </ListItemPrefix>
                <div>
                  <Typography color="pink" className="font-medium" variant="paragraph">
                    {value}
                  </Typography>
                </div>
              </label>
            </ListItem>
          ))}
        </List>
      </DialogBody>
      <DialogFooter className="flex justify-end space-x-2 border-t p-0 py-1.5 mx-2">
        {Buttons()}
      </DialogFooter>
    </Dialog>
  );
}
