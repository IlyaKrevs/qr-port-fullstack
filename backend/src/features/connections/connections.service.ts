import { IQRPort } from "@globalShared/types/entities/QRport.entity";
import { ConnectionsRepository } from "./connections.repository";
import { decryptAuthData } from "@utils/crypto/decrypt";
import { ApiError } from "@utils/basicApiFncs/ApiError";

interface IConnectionsService {
  connectionRepo: ConnectionsRepository;

  connect(authHeader: string): string;
  updateRole(userUniqId: string, role: IQRPort["role"]): boolean;
  getRole(userUniqId: string): IQRPort["role"] | undefined;
  hasRole(userUniqId: string, allowedRoles: IQRPort["role"][]): boolean;
  cleanup(maxIdleMs: number): number;
}

class ConnectionService implements IConnectionsService {
  connectionRepo: ConnectionsRepository;

  constructor(repo: ConnectionsRepository) {
    this.connectionRepo = repo;
  }

  connect(authHeader: string): string {
    const authData = decryptAuthData(authHeader);

    let userData = this.connectionRepo.get(authData.userUniqId);
    if (!userData) {
      userData = {
        id: authData.userUniqId,
        name: null,
        nonce: [],
        lastConnect: Date.now(),
        role: "guest",
      };
      this.connectionRepo.set(authData.userUniqId, userData);

      return authData.userUniqId;
    }

    if (userData.nonce.includes(authData.nonce)) {
      throw new ApiError(409, "Replay attack detected!");
    }

    userData.nonce.push(authData.nonce);
    userData.lastConnect = Date.now();
    this.connectionRepo.set(authData.userUniqId, userData);

    return authData.userUniqId;
  }

  updateRole(userUniqId: string, role: IQRPort["role"]): boolean {
    return this.connectionRepo.updateRole(userUniqId, role);
  }

  getRole(userUniqId: string): IQRPort["role"] | undefined {
    return this.connectionRepo.get(userUniqId)?.role;
  }

  hasRole(userUniqId: string, allowedRoles: IQRPort["role"][]): boolean {
    const role = this.getRole(userUniqId);
    return !!role && allowedRoles.includes(role);
  }

  cleanup(maxIdleMs: number): number {
    const now = Date.now();
    let deleted = 0;

    const currentStore = this.connectionRepo.getAll();

    for (const [id, data] of currentStore) {
      const isStale = data.lastConnect + maxIdleMs < now;
      if (isStale) {
        this.connectionRepo.remove(id);
        deleted++;
      }
    }
    return deleted;
  }
}

const repository = new ConnectionsRepository();
const service = new ConnectionService(repository);

// 1 hour
const oneHour = 60 * 60 * 1e3;
// 12 hours
const TTL = 12 * oneHour;

setInterval(() => {
  service.cleanup(TTL);
}, oneHour);

export const connectionService = service;
