import { useEffect, useState } from "react";

// Tracks live connectivity. Used to show a clear offline state where the app
// needs the network (Mr. Tang). The rest of the carnet works offline via the
// service worker, so only the network-bound features react to this.
export const useOnline = () => {
  const [online, setOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine
  );

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return online;
};
