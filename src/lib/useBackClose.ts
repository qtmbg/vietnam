import { useEffect, useRef } from "react";

// While an overlay (bottom-sheet, concierge…) is open, make the phone's / the
// browser's "back" gesture CLOSE it instead of leaving the app. It pushes a
// throwaway history entry when the overlay opens; a back navigation (popstate)
// then fires `onClose`. Closing via the UI (X or backdrop) steps that entry
// back off so history stays clean. This makes "revenir en arrière" behave the
// way everyone expects on mobile — the same gesture everywhere.
export function useBackClose(open: boolean, onClose: () => void) {
  const cb = useRef(onClose);
  cb.current = onClose;

  useEffect(() => {
    if (!open) return;
    let poppedByBack = false;
    window.history.pushState({ overlay: true }, "");
    const onPop = () => {
      poppedByBack = true;
      cb.current();
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      // Closed from the UI (not the back gesture): remove the entry we added.
      if (!poppedByBack) window.history.back();
    };
  }, [open]);
}
