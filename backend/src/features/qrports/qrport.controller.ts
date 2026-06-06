import { IQRPort } from "@globalShared/types/entities/QRport.entity";
import { QrPortService } from "./qrport.service";
import { createEndpoint } from "@utils/basicApiFncs/createEndpoint";

// create
type CreateQrBody = { name: IQRPort["name"]; role: IQRPort["role"] };
type CreateQrResponse = IQRPort;
type CreateQrEndpoint = typeof createEndpoint<CreateQrBody, CreateQrResponse>;

// getAll
type GetAllQrBody = {};
type GetAllQrResponse = IQRPort[];
type GetAllQrEndpoint = typeof createEndpoint<GetAllQrBody, GetAllQrResponse>;

type DeleteQrPortBody = void;
type DeleteQrPortResponse = { success: boolean };
type DeleteQrPortParams = { qrCode: IQRPort["qrCode"] };
type DeleteQrPortEndpoint = typeof createEndpoint<
  DeleteQrPortBody,
  DeleteQrPortResponse,
  DeleteQrPortParams
>;

interface IQrPortController {
  qrPortService: QrPortService;
  authEndpoint: typeof createEndpoint;
  getAll(): ReturnType<GetAllQrEndpoint>;
  create(): ReturnType<CreateQrEndpoint>;
  delete(): ReturnType<DeleteQrPortEndpoint>;
}

export class QrPortController implements IQrPortController {
  qrPortService: QrPortService;
  authEndpoint: typeof createEndpoint;

  constructor(qrPortService: QrPortService, authFn: typeof createEndpoint) {
    this.qrPortService = qrPortService;
    this.authEndpoint = authFn;
  }

  getAll() {
    return this.authEndpoint<GetAllQrBody, GetAllQrResponse>(
      async (req, userUniqId) => {
        const all = this.qrPortService.getAll();
        return all;
      },
    );
  }

  create() {
    return this.authEndpoint<CreateQrBody, CreateQrResponse>(
      async (req, userUniqId) => {
        const { name, role } = req.body;
        const newQrPort = this.qrPortService.createQrPort(name, role);
        return newQrPort;
      },
    );
  }

  // todo!!!
  delete() {
    return this.authEndpoint<
      DeleteQrPortBody,
      DeleteQrPortResponse,
      DeleteQrPortParams
    >(async (req, userUniqId) => {
      const { qrCode } = req.params;
      const result = this.qrPortService.delete(qrCode);
      return { success: result };
    });
  }
}
