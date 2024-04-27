export namespace KeyPress {
  type FunctionKey =
    | "F1"
    | "F2"
    | "F3"
    | "F4"
    | "F5"
    | "F6"
    | "F7"
    | "F8"
    | "F9"
    | "F10"
    | "F11"
    | "F12";
  // type CommandKey = "ctrl" | "alt" | "shift";
  export const DisableFunctionKey = (key_list?: FunctionKey[]) => {
    const set = new Set();
    if (key_list) {
      key_list.forEach((k) => {
        set.add(k);
      });
    } else {
      set.add("F1");
      set.add("F2");
      set.add("F3");
      set.add("F4");
      set.add("F5");
      set.add("F6");
      set.add("F7");
      set.add("F8");
      set.add("F9");
      set.add("F10");
      set.add("F11");
      set.add("F12");
    }
    document.addEventListener("keydown", (ev: KeyboardEvent) => {
      if (set.has(ev.key)) {
        ev.preventDefault();
        console.log(`${ev.key} disabled!`);
      }
    });
  };

  export const EnableFunctionKey = (key: FunctionKey, handler: () => void) => {
    document.addEventListener("keydown", (ev: KeyboardEvent) => {
      if (ev.key == key) {
        handler();
      }
    });
  };
}
