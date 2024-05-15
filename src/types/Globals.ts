import { BaseDirectory } from "@tauri-apps/api/fs";

const GlobalStrings = {
  LogFileName: "log.log",
  SelectContract: "Chọn hợp đồng",
  RecordFileName: "record.dat",
  SaveDirectory: BaseDirectory.Resource,
  NameProductCodeFile: "ma_hang.csv",
  NameExportLocation: "noi_xuat.csv",
  NameContractFile: "hop_dong.csv",
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
    Tt: "thực tế",
    Update: "sửa",
    Delete: "xóa"
  },
  ErrorMsg: {
    Report: {
      ContractNotSelected: `Vui lòng chọn một mã hợp đồng trước khi Kiểm Tra`,
      ReportFileNotFound: `Không thể tìm thấy dữ liệu của mã hợp đồng`
    }
  },
  InputStock: "_NhapTonDauKi_",
  NameBaoCaoQuyetToan: "BaoCaoQuyetToan.csv",
  NamePathJson: "path.json",
  NameResourcePath: "./resources/"
};

export default GlobalStrings;
