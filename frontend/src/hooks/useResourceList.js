import { useCallback, useEffect, useState } from "react";

import { unwrapList } from "../utils/apiData.js";

export function useResourceList(loader) {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const payload = await loader();
      setRecords(unwrapList(payload));
      setStatus("succeeded");
    } catch (caught) {
      setError(caught.message);
      setStatus("failed");
    }
  }, [loader]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    records,
    status,
    error,
    refresh,
  };
}
