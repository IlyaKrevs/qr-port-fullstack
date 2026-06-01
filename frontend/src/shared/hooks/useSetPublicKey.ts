import { ENDPOINTS } from "@globalShared/api/endpoints";
import { fetchApi } from "@shared/utils/fetchApi";
import { typedLocalStorage } from "@shared/utils/localStorage";
import { useEffect, useState } from "react";

export const useSetPrimaryData = (): boolean => {
  const [state, setState] = useState(false);
  useEffect(() => {
    fetchApi<{ publicKey: string; serverId: string }>(ENDPOINTS.defaultData)
      .then((r) => {
        const prevServerId = typedLocalStorage.get("serverId");
        if (prevServerId !== r.serverId) {
          typedLocalStorage.clear();
        }
        typedLocalStorage.set("serverId", r.serverId);
        typedLocalStorage.set("publicKey", r.publicKey);
      })
      .then(() => setState(true));
  }, []);

  return state;
};
