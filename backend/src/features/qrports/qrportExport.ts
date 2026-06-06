import { createEndpoint } from "@utils/basicApiFncs/createEndpoint";
import { QrPortRepository } from "./qrport.repository";
import { QrPortService } from "./qrport.service";
import { QrPortController } from "./qrport.controller";

const repository = new QrPortRepository();
const service = new QrPortService(repository);
export const qrPortController = new QrPortController(service, createEndpoint);
