import { IQRPort } from "@globalShared/types/entities/QRport.entity";
import { QrPortRepository } from "./qrport.repository";

interface IQrPortService {
  qrPortRepository: QrPortRepository;
  createQrPort(name: IQRPort["name"], role: IQRPort["role"]): IQRPort;
  getAll(): IQRPort[];
  getByQrCode(qrCodeId: IQRPort["qrCode"]): IQRPort | undefined;
  delete(qrCode: IQRPort["qrCode"]): boolean;
}

export class QrPortService implements IQrPortService {
  qrPortRepository: QrPortRepository;
  constructor(qrPortRep: QrPortRepository) {
    this.qrPortRepository = qrPortRep;
  }

  createQrPort(name: IQRPort["name"], role: IQRPort["role"]): IQRPort {
    return this.qrPortRepository.create(name, role);
  }

  getAll(): IQRPort[] {
    return this.qrPortRepository.getAll();
  }

  getByQrCode(qrCodeId: IQRPort["qrCode"]): IQRPort | undefined {
    return this.qrPortRepository.findByQrCode(qrCodeId);
  }

  delete(qrCode: IQRPort["qrCode"]): boolean {
    return this.qrPortRepository.delete(qrCode);
  }
}
