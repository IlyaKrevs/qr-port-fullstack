export interface IQRPort {
  id: string;
  qrCode: string;
  role: "admin" | "guest";
  name: string;
}
