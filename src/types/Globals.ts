import { BaseDirectory } from "@tauri-apps/api/fs";

const GlobalStrings = {
  LogFileName: "log.log",
  SelectContract: "Chọn hợp đồng",
  RecordFileName: "record.dat",
  SaveDirectory: BaseDirectory.Resource,
  ProductCodeFileName: "ma_hang.csv",
  ReleaseLocationFileName: "noi_xuat.csv",
  ContractFileName: "hop_dong.csv",
  TableColumn: {
    STT: "STT",
    NoiXuat: "nơi xuất",
    SoBill: "số bill",
    NgChTu: "ngày chứng từ",
    MaHD: "mã hợp đồng",
    NgThTe: "ngày thực tế",
    Sl: "số lượng",
    Nhap: "nhập",
    Xuat: "xuất",
    Ton: "tồn",
    Gc: "gia công",
    Tp: "thành phẩm",
    Tt: "thực tế"
  }
};

export default GlobalStrings;
