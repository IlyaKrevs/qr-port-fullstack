import { IQRPort } from "./QRport.entity";

export interface ISession {
  id: string;
  qrPortId: IQRPort["id"];
  usersUniqId: string[];
  startedAt: number;
  endedAt: number | null;
}
