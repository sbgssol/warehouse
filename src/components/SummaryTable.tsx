import { ChangeEvent, MutableRefObject } from "react";
import { WarehouseData } from "../types/ImportWarehouseData";
import { useGlobalState } from "../types/GlobalContext";

export default function SummaryTable(props: {
  data: WarehouseData.Record;
  amount?: number[];
  input_ref: MutableRefObject<HTMLInputElement[]>;
}) {
  const { product } = useGlobalState();

  if (props.data.danh_sach_san_pham.length) {
    return (
      <div className="max-w-[98%] w-full overflow-y-auto max-h-[38vh] mt-2">
        <table className="text-center mt-2">
          <thead className="">
            <tr>
              <th className="uppercase ">STT</th>
              <th className="uppercase ">Mã hàng</th>
              <th className="uppercase ">Tên hàng</th>
              <th className="uppercase ">Đơn vị tính</th>
              <th className="uppercase ">Số lượng</th>
            </tr>
          </thead>
          <tbody className="">
            {props.data.danh_sach_san_pham.flatMap((detail, index) => (
              <tr key={index}>
                <td className="border border-black overflow-hidden max-w-[54%] w-[5%]">
                  {index + 1}
                </td>
                <td className="text-left border border-black overflow-hidden max-w-[25%] pl-1 w-[25%]">
                  {detail.ma_hang}
                </td>
                <td className="text-left border  border-black overflow-hidden max-w-[45%] pl-1 w-[45%]">
                  {product.getInfo(detail.ma_hang, "name")}
                </td>
                <td className="border border-black overflow-hidden max-w-[14%] w-[14%]">
                  {product.getInfo(detail.ma_hang, "unit")}
                </td>
                <td className="border border-black overflow-hidden max-w-[14%] w-[14%]">
                  <input
                    placeholder="_"
                    type="number"
                    value={props.amount !== undefined ? props.amount[index] : 0}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      if ((event.target.value as unknown as number) <= 0) {
                        event.target.value = "0";
                      }
                    }}
                    ref={(ref) => {
                      if (ref) {
                        props.input_ref.current[index] = ref;
                      }
                    }}
                    className={`w-full pl-2 bg-gray-50`}></input>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return <></>;
}
