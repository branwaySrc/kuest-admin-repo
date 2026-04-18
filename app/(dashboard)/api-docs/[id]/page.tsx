"use client";

import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getApiDocumentBySlug } from "../(content)";
import { AlertCircle } from "lucide-react";

const getMethodColor = (method: string) => {
  switch (method.toUpperCase()) {
    case "GET": return "bg-black text-blue-500 border-neutral-800";
    case "POST": return "bg-black text-emerald-500 border-neutral-800";
    case "PUT": return "bg-black text-amber-500 border-neutral-800";
    case "DELETE": return "bg-black text-red-500 border-neutral-800";
    default: return "bg-black text-neutral-400 border-neutral-800";
  }
};

export default function ApiDocDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const doc = getApiDocumentBySlug(resolvedParams.id);

  if (!doc) {
    return (
      <div className="flex w-full h-full items-center justify-center text-muted-foreground flex-col ">
        <AlertCircle size={48} strokeWidth={1} className="opacity-20 text-destructive" />
        <p>요청하신 API 문서를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full overflow-y-auto p-8 scrollbar-thin mt-4">
      <div className="w-full  pb-12">
        <div className="mb-4">
          <h2 className="text-xl font-bold font-mono tracking-tight text-neutral-100">{doc.title}</h2>
          <p className="text-neutral-400 mt-3 text-[15px] leading-relaxed max-w-2xl">{doc.description}</p>
        </div>

        <Accordion type="multiple" defaultValue={[doc.endpoints[0]?.path]} className="w-full space-y-4">
          {doc.endpoints.map((ep, idx) => (
            <AccordionItem 
              key={idx} 
              value={ep.path}
              className="border border-neutral-800 bg-[#000000] rounded-xl overflow-hidden px-5 shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline py-5">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className={`${getMethodColor(ep.method)} border px-2.5 py-0.5 text-xs font-bold rounded shadow-sm`}>
                    {ep.method}
                  </Badge>
                  <span className="font-mono font-semibold text-base tracking-tight text-neutral-200">{ep.path}</span>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="pb-6 pt-1">
                <p className="text-neutral-400 mb-6 leading-relaxed text-sm">
                  {ep.description}
                </p>

                <div className="border border-neutral-800 rounded-lg overflow-hidden bg-[#000000] shadow-sm">
                  <Tabs defaultValue={ep.responses[0]?.status.toString()} className="w-full">
                    <div className="bg-[#0a0a0a] px-3 flex items-center border-b border-neutral-800 overflow-x-auto scrollbar-none">
                      <TabsList className="bg-transparent h-12 gap-5 w-auto">
                        {ep.responses.map((res, rIdx) => (
                          <TabsTrigger 
                            key={rIdx} 
                            value={res.status.toString()}
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neutral-200 rounded-none px-1 transition-all"
                          >
                            <span className={`font-mono text-xs font-medium ${res.status >= 400 ? 'text-red-400' : 'text-neutral-300'}`}>
                              {res.status} {res.label}
                            </span>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>
                    
                    <div className="p-5 bg-[#000000]">
                      {ep.responses.map((res, rIdx) => (
                        <TabsContent key={rIdx} value={res.status.toString()} className="m-0 mt-0 focus-visible:ring-0">
                          <pre className={`font-mono text-sm leading-relaxed overflow-x-auto ${res.status >= 400 ? 'text-red-400/90' : 'text-neutral-300'}`}>
                            {res.code}
                          </pre>
                        </TabsContent>
                      ))}
                    </div>
                  </Tabs>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
