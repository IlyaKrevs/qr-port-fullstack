import { createEndpoint } from "@utils/basicApiFncs/createEndpoint";
import { SessionRepository } from "./session.repository";
import { SessionService } from "./session.service";
import { SessionController } from "./session.controller";

const repository = new SessionRepository();
const service = new SessionService(repository);
export const sessionController = new SessionController(service, createEndpoint);
