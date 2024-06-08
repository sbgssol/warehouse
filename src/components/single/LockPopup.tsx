import { Typography } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { Common } from "../../types/GlobalFnc";
import { useGlobalState } from "../../types/GlobalContext";

export default function LockPopup() {
  const inpRef = useRef<(HTMLInputElement | null)[]>([]);
  const [inpIdx, setInpIdx] = useState(0);
  const { lock } = useGlobalState();
  const numInputs = 6;

  useEffect(() => {
    if (inpRef.current && inpRef.current[inpIdx] !== null) {
      inpRef.current[inpIdx]?.focus();
      inpRef.current[inpIdx]?.select();
    }
  }, [inpIdx]);

  useEffect(() => {
    if (inpRef.current[0]) {
      inpRef.current[0]?.focus();
    }
  }, []);

  const checkBingo = () => {
    const values = inpRef.current.map((input) => input?.value);
    if (values.join("") === "040776") {
      lock.setOpen(false);
      lock.setVerified(true);
      Common.Log(`BINGO`);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = event.target.value;
    if (value.length > 1) {
      event.target.value = value.charAt(-1);
    }
    if (value.length === 1 && idx < numInputs - 1) {
      setInpIdx(idx + 1);
    }
    if (value.length === 0 && idx > 0) {
      setInpIdx(idx - 1);
    }
    checkBingo(); // Check for BINGO after each input change
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (event.key === "Backspace" && !event.currentTarget.value && idx > 0) {
      setInpIdx(idx - 1);
      setTimeout(() => inpRef.current[idx - 1]?.select(), 0);
    } else if (event.key === "ArrowLeft" && idx > 0) {
      setInpIdx(idx - 1);
      setTimeout(() => inpRef.current[idx - 1]?.select(), 0);
    } else if (event.key === "ArrowRight" && idx < numInputs - 1 && event.currentTarget.value) {
      setInpIdx(idx + 1);
      setTimeout(() => inpRef.current[idx + 1]?.select(), 0);
    }
  };

  const inp_twstyles =
    "shadow-md w-[55px] h-[55px] rounded-md text-[50px] text-center drop-shadow-md focus:bg-teal-50 font-myRegular focus:outline-none bg-gray-50";

  const Body = () => (
    <div className={`w-full flex justify-center flex-col items-center`}>
      <Typography variant="h2" className={`uppercase`} color="teal">
        nhập mã pin
      </Typography>
      <div className={`p-8 shadow-lg rounded-xl space-x-2 drop-shadow-lg bg-white`}>
        {Array.from({ length: numInputs }).map((_, idx) => (
          <input
            type="password"
            key={idx}
            ref={(el) => (inpRef.current[idx] = el)}
            maxLength={1}
            className={`${inp_twstyles}`}
            onFocus={() => {
              setInpIdx(idx);
              inpRef.current[idx]?.select();
            }}
            onChange={(event) => handleInputChange(event, idx)}
            onKeyDown={(event) => handleKeyDown(event, idx)}
          />
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    if (lock.verified == false) {
      setTimeout(() => {
        lock.setOpen(true);
      }, 500);
    }

    return () => {};
  }, [lock.verified]);

  return (
    <div
      className={`w-full h-[99%] absolute bg-gray-100 overflow-hidden flex items-center select-none`}>
      {Body()}
    </div>
  );
}
