import { ChangeEvent, MutableRefObject } from "react";
import { ImportData } from "../types/ImportWarehouseData";

export default function SummaryTable(props: {
  data: ImportData.Data;
  input_ref: MutableRefObject<HTMLInputElement[]>;
}) {
  if (props.data.danh_sach_san_pham.length) {
    return (
      <div className="max-w-[780px] w-full overflow-y-auto max-h-[38vh] mt-2">
        <table className="text-center mt-2">
          <thead className="">
            <tr>
              <th className="uppercase text-green-700">Mã hàng</th>
              <th className="uppercase text-green-700">Tên hàng</th>
              <th className="uppercase text-green-700">Đơn vị tính</th>
              <th className="uppercase text-green-700">Số lượng</th>
            </tr>
          </thead>
          <tbody className="">
            {props.data.danh_sach_san_pham.flatMap((detail, index) => (
              <tr key={index}>
                <td
                  className="text-left border border-green-600 overflow-hidden max-w-[200px] pl-1"
                  width={200}
                >
                  {detail.ma_hang}
                </td>
                <td
                  className="text-left border  border-green-600 overflow-hidden max-w-[500px] pl-1"
                  width={500}
                >
                  {detail.ten_hang}
                </td>
                <td
                  className="border border-green-600 overflow-hidden max-w-[150px]"
                  width={150}
                >
                  {detail.don_vi_tinh}
                </td>
                <td
                  className="border border-green-600 overflow-hidden max-w-[150px]"
                  width={150}
                >
                  <input
                    placeholder="_"
                    type="number"
                    // ref={amountRef}
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
                    className={`w-full pl-2 bg-gray-50`}
                  ></input>
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
