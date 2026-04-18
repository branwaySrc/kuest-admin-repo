"use client";

import { useSyncExternalStore, useState, useEffect } from "react";
import { useAppViewerStore } from "@/lib/store/use-app-viewer-store";
import { useResizable } from "@/hooks/use-resizable";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

const emptySubscribe = () => () => {};

export default function AppViwer() {
  const { isOpen, setIsOpen } = useAppViewerStore();
  const [currentUrl] = useState("https://m.a-bly.com/");

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const { size, setSize, startResizing } = useResizable({
    initialSize: 420,
    direction: "horizontal",
    minSize: 150, 
    maxSize: mounted ? window.innerWidth * 0.5 : 800,
  });

  // 200px 이하로 드래그 시 자동으로 접히는 로직
  useEffect(() => {
    if (isOpen && size < 200) {
      setIsOpen(false);
      setTimeout(() => setSize(420), 300);
    }
  }, [size, isOpen, setIsOpen, setSize]);

  if (!mounted) return null;

  return (
    <aside
      className={cn(
        "fixed right-0 top-0 z-[100] flex h-screen flex-col border-l border-border bg-[#0a0a0a] transition-transform duration-100 ease-in-out overflow-hidden shadow-2xl",
        !isOpen && "translate-x-full"
      )}
      style={{ 
        width: `${size}px`,
        visibility: isOpen ? "visible" : "hidden"
      }}
    >
      {/* Resize Handle */}
      <div
        onMouseDown={startResizing}
        className="absolute left-0 top-0 h-full w-1 cursor-ew-resize transition-colors hover:bg-primary/50 active:bg-primary z-50"
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Device Viewer Area */}
        <div className="flex-1 overflow-hidden p-6 flex flex-col items-center justify-center bg-[#0d0d0d]">
          {/* Smartphone Mockup */}
          <div className="relative shrink-0 mx-auto h-[740px] w-[360px] rounded-[3.1rem] border-[12px] border-zinc-800 bg-zinc-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] outline outline-1 outline-zinc-700/50">
            {/* Notch / Dynamic Island */}
            <div className="absolute left-1/2 top-4 z-10 h-7 w-28 -translate-x-1/2 rounded-full bg-black flex items-center justify-end px-4">
               <div className="h-2 w-2 rounded-full bg-zinc-800" />
            </div>
            
            {/* Content Window (WebView) */}
            <div className="h-full w-full overflow-hidden rounded-[2.3rem] bg-white border border-zinc-800">
              <iframe
                src={currentUrl}
                className="h-full w-full border-none"
                title="App WebView"
              />
            </div>

            {/* Side Buttons (Volume/Power) */}
            <div className="absolute -left-[14px] top-32 h-10 w-[3px] rounded-l-sm bg-zinc-700" />
            <div className="absolute -left-[14px] top-48 h-16 w-[3px] rounded-l-sm bg-zinc-700" />
            <div className="absolute -left-[14px] top-[260px] h-16 w-[3px] rounded-l-sm bg-zinc-700" />
            <div className="absolute -right-[14px] top-40 h-24 w-[3px] rounded-r-sm bg-zinc-700" />
          </div>
        </div>
      </div>
    </aside>
  );
}