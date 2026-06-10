import { IQRPort } from "@globalShared/types/entities/QRport.entity";
import { QrPortService } from "./qrport.service";
import { createEndpoint } from "@utils/basicApiFncs/createEndpoint";
import { ConnectionService } from "@features/connections/connections.service";
import { ApiError } from "@utils/basicApiFncs/ApiError";

// create
type CreateQrBody = { name: IQRPort["name"]; role: IQRPort["role"] };
type CreateQrResponse = IQRPort;
type CreateQrEndpoint = typeof createEndpoint<CreateQrBody, CreateQrResponse>;

// getAll
type GetAllQrBody = {};
type GetAllQrResponse = IQRPort[];
type GetAllQrEndpoint = typeof createEndpoint<GetAllQrBody, GetAllQrResponse>;

type DeleteQrPortBody = void;
type DeleteQrPortResponse = void;
type DeleteQrPortParams = { qrCode: IQRPort["qrCode"] };
type DeleteQrPortEndpoint = typeof createEndpoint<
  DeleteQrPortBody,
  DeleteQrPortResponse,
  DeleteQrPortParams
>;

interface IQrPortController {
  authEndpoint: typeof createEndpoint;
  qrPortService: QrPortService;

  getAll(): ReturnType<GetAllQrEndpoint>;
  create(): ReturnType<CreateQrEndpoint>;
  delete(): ReturnType<DeleteQrPortEndpoint>;
}

export class QrPortController implements IQrPortController {
  authEndpoint: typeof createEndpoint;
  qrPortService: QrPortService;

  constructor(authFn: typeof createEndpoint, qrPortService: QrPortService) {
    this.authEndpoint = authFn;

    this.qrPortService = qrPortService;
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
        if (!name || !role) {
          throw new ApiError(400, "Missing name or role");
        }
        const newQrPort = this.qrPortService.createQrPort(name, role);
        return newQrPort;
      },
    );
  }

  delete() {
    return this.authEndpoint<
      DeleteQrPortBody,
      DeleteQrPortResponse,
      DeleteQrPortParams
    >(async (req, userUniqId) => {
      const { qrCode } = req.params;
      const result = this.qrPortService.delete(qrCode);
      if (!result) {
        throw new ApiError(404, "QR-code not found");
      }
    });
  }
}
