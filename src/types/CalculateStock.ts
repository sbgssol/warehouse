import { ShortenData } from "./ShortenData";

export const CalculateStock = (data: Map<string, ShortenData[]>) => {
  const tmp = new Map(data);
  tmp.forEach((value) => {
    value.forEach((s, index, arr) => {
      let previous_idx = index > 0 ? index - 1 : index;
      s.sl_ton_tt = Number(
        (
          Number(s.sl_nhap ?? 0) +
          Number(s.sl_ton_tt ?? 0) +
          Number(arr[previous_idx].sl_ton_tt ?? 0) -
          Number(s.sl_xuat_gc ?? 0)
        ).toFixed(4)
      );
      s.sl_ton_tp = Number(
        (
          Number(arr[previous_idx].sl_ton_tp ?? 0) +
          Number(s.sl_xuat_gc ?? 0) -
          Number(s.sl_xuat_tp ?? 0)
        ).toFixed(4)
      );
      if (s.sl_ton_tp == 0) s.sl_ton_tp = undefined;
    });
  });
  return tmp;
};

export const ModifyValue = () => {};
