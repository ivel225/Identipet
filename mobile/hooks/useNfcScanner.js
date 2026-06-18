import { useState } from "react";

import { readNtag215UniqueCode } from "../services/nfcService";

export function useNfcScanner() {
  const [isScanning, setIsScanning] = useState(false);

  async function scanTag() {
    setIsScanning(true);
    try {
      return await readNtag215UniqueCode();
    } finally {
      setIsScanning(false);
    }
  }

  return { isScanning, scanTag };
}
