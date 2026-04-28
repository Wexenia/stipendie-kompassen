import { ReactNode } from "react";
import BottomTabs from "./BottomTabs";

/**
 * App-shell that frames everything as a phone on desktop.
 * On small screens it goes edge-to-edge.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center md:p-6">
      {/* Phone frame */}
      <div className="relative w-full md:w-[430px] md:h-[900px] md:max-h-[calc(100vh-3rem)] md:rounded-[44px] bg-app md:shadow-phone md:border md:border-white/10 md:overflow-hidden h-screen overflow-hidden flex flex-col">
        {/* Status bar (desktop only) */}
        <div className="hidden md:flex items-center justify-between px-7 pt-3 pb-1 text-[11px] font-semibold text-foreground/80 shrink-0">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <span>•••</span>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          {children}
        </div>

        <BottomTabs />
      </div>
    </div>
  );
}
