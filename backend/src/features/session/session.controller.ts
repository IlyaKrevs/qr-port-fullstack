import { createEndpoint } from "@utils/basicApiFncs/createEndpoint";
import { ISessionService } from "./session.service";
import { ISession } from "@globalShared/types/entities/Session.entity";

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
  sessionService: ISessionService;
  authEndpoint: typeof createEndpoint;
  getAllActive(): ReturnType<GetAllActiveEndpoint>;
  join(): ReturnType<JoinEndpoint>;
  close(): ReturnType<CloseEndpoint>;
}

export class SessionController implements ISessionController {
  sessionService: ISessionService;
  authEndpoint: typeof createEndpoint;
  constructor(sessionService: ISessionService, authFn: typeof createEndpoint) {
    this.sessionService = sessionService;
    this.authEndpoint = authFn;
  }

  // todo - make roles check
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

  // todo - make roles check
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
