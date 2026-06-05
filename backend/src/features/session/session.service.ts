import { IQRPort } from "@globalShared/types/entities/QRport.entity";
import { ISessionRepository } from "./session.repository";
import { ISession } from "@globalShared/types/entities/Session.entity";

export interface ISessionService {
  sessionRepository: ISessionRepository;

  getAllActive(): ISession[];

  joinOrCreateSession(qrPortId: IQRPort["id"], userUniqId: string): ISession;
  addUserToSession(session: ISession, userUniqId: string): void;
  closeSession(sessionId: ISession["id"]): boolean;
}

export class SessionService implements ISessionService {
  sessionRepository: ISessionRepository;

  constructor(sessionRep: ISessionRepository) {
    this.sessionRepository = sessionRep;
  }

  getAllActive(): ISession[] {
    return this.sessionRepository.getAllActive();
  }

  addUserToSession(session: ISession, userUniqId: string) {
    if (session.endedAt !== null) {
      throw new Error("Session ended");
    }
    if (session.isPrivate) {
      throw new Error("Session is private");
    }
    this.sessionRepository.addUser(session.id, userUniqId);
  }

  joinOrCreateSession(qrPortId: IQRPort["id"], userUniqId: string): ISession {
    let session = this.sessionRepository.findByQrPortId(qrPortId);

    if (!session) {
      session = this.sessionRepository.create(qrPortId, userUniqId);
    } else {
      this.addUserToSession(session, userUniqId);
    }
    return session;
  }
  closeSession(sessionId: ISession["id"]): boolean {
    const session = this.sessionRepository.findBySessionId(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    if (session.endedAt !== null) {
      throw new Error("Session already closed");
    }
    return this.sessionRepository.closeSession(sessionId);
  }
}
