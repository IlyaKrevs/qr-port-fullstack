import { ENDPOINTS } from "@globalShared/api/endpoints";

import { typedLocalStorage } from "@shared/utils/localStorage";
import { useEffect, useState } from "react";

export const useSetPrimaryData = (): boolean => {
  const [state, setState] = useState(false);

  useEffect(() => {
    fetch(ENDPOINTS.defaultData)
      .then((r) => r.json())
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

