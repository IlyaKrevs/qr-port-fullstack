import { IQRPort } from "@globalShared/types/entities/QRport.entity";
import { ISession } from "@globalShared/types/entities/Session.entity";

interface ISessionRepository {
  currentSessions: ISession[];
  // create
  create(qrPortId: IQRPort["id"], userUniqId: string): ISession;

  // read
  getAll(): ISession[];
  getAllActive(): ISession[];
  findBySessionId(sessionId: ISession["id"]): ISession | undefined;
  findByQrPortId(qrId: IQRPort["id"]): ISession | undefined;

  // update
  addUser(sessionId: ISession["id"], userUniqId: string): boolean;
  deleteUser(sessionId: ISession["id"], userUniqId: string): boolean;
  closeSession(sessionId: ISession["id"]): boolean;

  // delete
}

export class SessionRepository implements ISessionRepository {
  static instance: SessionRepository;
  currentSessions: ISession[] = [];

  constructor() {
    if (SessionRepository.instance) {
      return SessionRepository.instance;
    }
    SessionRepository.instance = this;
  }

  create(qrPortId: IQRPort["id"], userUniqId: string): ISession {
    const newSession: ISession = {
      id: crypto.randomUUID(),
      qrPortId: qrPortId,
      usersUniqId: [userUniqId],
      isPrivate: false,
      startedAt: Date.now(),
      endedAt: null,
    };
    this.currentSessions.push(newSession);
    return { ...newSession };
  }

  getAll() {
    return [...this.currentSessions];
  }
  getAllActive(): ISession[] {
    return this.currentSessions.filter((i) => i.endedAt === null);
  }

  findBySessionId(sessionId: ISession["id"]): ISession | undefined {
    const session = this.currentSessions.find((i) => i.id === sessionId);
    return session ? { ...session } : undefined;
  }
  findByQrPortId(qrId: IQRPort["id"]): ISession | undefined {
    const session = this.currentSessions.find((i) => i.qrPortId === qrId);
    return session ? { ...session } : undefined;
  }

  addUser(sessionId: ISession["id"], userUniqId: string): boolean {
    const session = this.findBySessionId(sessionId);
    if (session && !session.usersUniqId.includes(userUniqId)) {
      session.usersUniqId.push(userUniqId);
      return true;
    }
    return false;
  }

  deleteUser(sessionId: ISession["id"], userUniqId: string): boolean {
    const session = this.findBySessionId(sessionId);
    if (session && session.usersUniqId.includes(userUniqId)) {
      session.usersUniqId = session.usersUniqId.filter((i) => i !== userUniqId);
      return true;
    }
    return false;
  }

  closeSession(sessionId: ISession["id"]): boolean {
    const session = this.findBySessionId(sessionId);
    if (session) {
      session.endedAt = Date.now();
      return true;
    }
    return false;
  }
}
