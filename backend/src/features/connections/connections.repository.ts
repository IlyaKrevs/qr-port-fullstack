import { IQRPort } from "@globalShared/types/entities/QRport.entity";

interface IServerUserData {
  id: string;
  name: string | null;
  nonce: string[];
  lastConnect: number;
  role: IQRPort["role"];
}

interface IConnectionsRepository {
  store: Map<string, IServerUserData>;
  get(userUniqId: IServerUserData["id"]): IServerUserData | undefined;
  set(useruniqId: IServerUserData["id"], data: IServerUserData): void;
  updateRole(
    userUniqId: IServerUserData["id"],
    role: IServerUserData["role"],
  ): boolean;
  remove(userUniqId: string): void;
  getAll(): Map<string, IServerUserData>;
}

export class ConnectionsRepository implements IConnectionsRepository {
  static instance: ConnectionsRepository;
  store: Map<string, IServerUserData> = new Map<string, IServerUserData>();

  constructor() {
    if (ConnectionsRepository.instance) {
      return ConnectionsRepository.instance;
    }
    ConnectionsRepository.instance = this;
  }

  get(userUniqId: IServerUserData["id"]): IServerUserData | undefined {
    return this.store.get(userUniqId);
  }

  set(useruniqId: IServerUserData["id"], data: IServerUserData): void {
    this.store.set(useruniqId, data);
  }

  updateRole(
    userUniqId: IServerUserData["id"],
    role: IServerUserData["role"],
  ): boolean {
    const user = this.store.get(userUniqId);
    if (user) {
      user.role = role;
      return true;
    }
    return false;
  }

  remove(userUniqId: string): void {
    const user = this.get(userUniqId);
    if (!user) {
      return;
    }
    this.store.delete(userUniqId);
  }

  getAll(): Map<string, IServerUserData> {
    return new Map(this.store);
  }
}
