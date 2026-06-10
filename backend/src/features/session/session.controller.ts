import { createEndpoint } from "@utils/basicApiFncs/createEndpoint";
import { SessionService } from "./session.service";
import { ISession } from "@globalShared/types/entities/Session.entity";
import { QrPortService } from "@features/qrports/qrport.service";
import { ConnectionService } from "@features/connections/connections.service";
import { ApiError } from "@utils/basicApiFncs/ApiError";

// join
type JoinBody = { qrCodeId: string };
type JoinResponse = { sessionId: string; userCount: number };
type JoinEndpoint = typeof createEndpoint<JoinBody, JoinResponse>;

// getAllActive
type GetAllActiveBody = {};
type GetAllActiveResponse = { sessions: ISession[] };
type GetAllActiveEndpoint = typeof createEndpoint<
  GetAllActiveBody,
  GetAllActiveResponse
>;

// close
type CloseBody = { sessionId: string };
type CloseResponse = { sessionId: string };
type CloseEndpoint = typeof createEndpoint<CloseBody, CloseResponse>;

interface ISessionController {
  authEndpoint: typeof createEndpoint;

  sessionService: SessionService;

  getAllActive(): ReturnType<GetAllActiveEndpoint>;
  join(): ReturnType<JoinEndpoint>;
  close(): ReturnType<CloseEndpoint>;
}

export class SessionController implements ISessionController {
  authEndpoint: typeof createEndpoint;

  sessionService: SessionService;

  constructor(authFn: typeof createEndpoint, sessions: SessionService) {
    this.authEndpoint = authFn;

    this.sessionService = sessions;
  }

  getAllActive() {
    return this.authEndpoint<GetAllActiveBody, GetAllActiveResponse>(
      async (req, userUniqId) => {
        const sessions = this.sessionService.getAllActive();
        return { sessions };
      },
    );
  }

  join() {
    return this.authEndpoint<JoinBody, JoinResponse>(
      async (req, userUniqId) => {
        const { qrCodeId } = req.body;

        const session = this.sessionService.joinOrCreateSession(
          qrCodeId,
          userUniqId,
        );

        return {
          sessionId: session.id,
          userCount: session.usersUniqId.length,
        };
      },
    );
  }

  close() {
    return this.authEndpoint<CloseBody, CloseResponse>(
      async (req, userUniqId) => {
        const { sessionId } = req.body;
        this.sessionService.closeSession(sessionId);
        return { sessionId };
      },
    );
  }
}
