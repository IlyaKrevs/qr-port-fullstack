export interface IServerUserData {
  id: string;
  name: string | null;
  nonce: string[];
  lastConnect: number;
}

export const userConnections = new Map<string, IServerUserData>();
