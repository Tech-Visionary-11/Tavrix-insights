import { useState } from "react";

/** Global sidebar state */
export function useSidebar() {
  /* mobile drawer */
  const [isOpen, setIsOpen] = useState(true);
  /* desktop collapse */
  const [collapsed, setCollapsed] = useState(false);

  /* ── helpers ── */
  const toggleMobile   = () => setIsOpen((p) => !p);
  const toggleCollapse = () => setCollapsed((p) => !p);
  const closeMobile    = () => setIsOpen(false);

  return { isOpen, collapsed, toggleMobile, toggleCollapse, closeMobile };
}
