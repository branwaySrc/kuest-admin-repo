"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileJson } from "lucide-react";
import { apiDocuments } from "./(content)";

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-[calc(100vh-140px)] w-full gap-6 text-foreground">
      {/* Left Sidebar Menu */}
      <div className="w-[280px] shrink-0 flex flex-col gap-4 border-r border-neutral-800 pr-4 py-4">
        
        <div className="px-2">
          <p className="text-xs text-neutral-500 leading-relaxed font-medium">
           백엔드 Route 스펙 문서 리스트
          </p>
        </div>

        <div className="flex-1 w-full overflow-y-auto scrollbar-thin">
          <div className="space-y-1.5 px-1">
            {apiDocuments.map((doc) => {
              const isActive = pathname === `/api-docs/${doc.id}`;
              return (
                <Link
                  key={doc.id}
                  href={`/api-docs/${doc.id}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-sm font-medium ${
                    isActive
                      ? "bg-neutral-900 border border-neutral-800 text-neutral-100 shadow-sm"
                      : "text-neutral-500 border border-transparent hover:bg-neutral-900/50 hover:text-neutral-200"
                  }`}
                >
                  <FileJson size={16} className={isActive ? "text-neutral-100" : "text-neutral-500"} />
                  <span className="truncate">{doc.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden ">
        {children}
      </div>
    </div>
  );
}
