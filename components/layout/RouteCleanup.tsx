"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RouteCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    // Radix UI (used by Shadcn for Sheet, Dialog, DropdownMenu) adds pointer-events: none 
    // and data-scroll-locked to the body when a modal opens. 
    // If a Next.js route change unmounts the modal abruptly, it bypasses the cleanup,
    // leaving the page completely unresponsive ("stuck") until a hard reload.
    // This hook forces a cleanup on every route change.
    document.body.style.pointerEvents = "";
    document.body.style.overflow = "";
    document.body.removeAttribute("data-scroll-locked");
  }, [pathname]);

  return null;
}
