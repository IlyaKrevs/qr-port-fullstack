import { IQRPort } from "./QRport.entity";

export interface ISession {
  id: string;
  qrPortId: IQRPort["id"];
  usersUniqId: string[];
  isPrivate: boolean;
  startedAt: number;
  endedAt: number | null;
}
