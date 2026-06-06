import { IQRPort } from "@globalShared/types/entities/QRport.entity";

interface IQrPortRepository {
  qrPorts: IQRPort[];
  create(name: IQRPort["name"], role: IQRPort["role"]): IQRPort;

  getAll(): IQRPort[];
  findByQrCode(qrCode: IQRPort["qrCode"]): IQRPort | undefined;
  delete(qrCode: IQRPort["qrCode"]): boolean;
}

export class QrPortRepository implements IQrPortRepository {
  static instance: QrPortRepository;
  qrPorts: IQRPort[] = [];

  constructor() {
    if (QrPortRepository.instance) {
      return QrPortRepository.instance;
    }
    QrPortRepository.instance = this;
  }

  create(name: IQRPort["name"], role: IQRPort["role"]): IQRPort {
    const newQrPort: IQRPort = {
      id: crypto.randomUUID(),
      qrCode: crypto.randomUUID(),
      role: role,
      name: name,
    };
    this.qrPorts.push(newQrPort);
    return { ...newQrPort };
  }

  getAll(): IQRPort[] {
    return [...this.qrPorts];
  }

  findByQrCode(qrCode: IQRPort["qrCode"]): IQRPort | undefined {
    const qrPort = this.qrPorts.find((i) => i.qrCode === qrCode);
    return qrPort ? { ...qrPort } : undefined;
  }

  delete(qrCode: IQRPort["qrCode"]): boolean {
    const qrPort = this.qrPorts.find((i) => (i.qrCode = qrCode));
    if (qrPort) {
      this.qrPorts = this.qrPorts.filter((i) => i.qrCode !== qrCode);
      return true;
    }
    return false;
  }
}
