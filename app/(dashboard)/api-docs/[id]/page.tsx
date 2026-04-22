'use client'

import { use } from 'react'
import { Badge } from '@/client/department-ui/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/client/department-ui/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/client/department-ui/ui/tabs'
import { getApiDocumentBySlug } from '../(content)'
import { AlertCircle } from 'lucide-react'

const getMethodColor = (method: string) => {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'bg-black text-blue-500 border-neutral-800'
    case 'POST':
      return 'bg-black text-emerald-500 border-neutral-800'
    case 'PUT':
      return 'bg-black text-amber-500 border-neutral-800'
    case 'DELETE':
      return 'bg-black text-red-500 border-neutral-800'
    default:
      return 'bg-black text-neutral-400 border-neutral-800'
  }
}

export default function ApiDocDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const doc = getApiDocumentBySlug(resolvedParams.id)

  if (!doc) {
    return (
      <div className="text-muted-foreground flex h-full w-full flex-col items-center justify-center">
        <AlertCircle size={48} strokeWidth={1} className="text-destructive opacity-20" />
        <p>요청하신 API 문서를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="scrollbar-thin mt-4 h-full w-full flex-1 overflow-y-auto p-8">
      <div className="w-full pb-12">
        <div className="mb-4">
          <h2 className="font-mono text-xl font-bold tracking-tight text-neutral-100">
            {doc.title}
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-neutral-400">
            {doc.description}
          </p>
        </div>

        <Accordion
          type="multiple"
          defaultValue={[doc.endpoints[0]?.path]}
          className="w-full space-y-4"
        >
          {doc.endpoints.map((ep, idx) => (
            <AccordionItem
              key={idx}
              value={ep.path}
              className="overflow-hidden rounded-xl border border-neutral-800 bg-[#000000] px-5 shadow-sm"
            >
              <AccordionTrigger className="py-5 hover:no-underline">
                <div className="flex items-center gap-4">
                  <Badge
                    variant="outline"
                    className={`${getMethodColor(ep.method)} rounded border px-2.5 py-0.5 text-xs font-bold shadow-sm`}
                  >
                    {ep.method}
                  </Badge>
                  <span className="font-mono text-base font-semibold tracking-tight text-neutral-200">
                    {ep.path}
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-1 pb-6">
                <p className="mb-6 text-sm leading-relaxed text-neutral-400">{ep.description}</p>

                <div className="overflow-hidden rounded-lg border border-neutral-800 bg-[#000000] shadow-sm">
                  <Tabs defaultValue={ep.responses[0]?.status.toString()} className="w-full">
                    <div className="scrollbar-none flex items-center overflow-x-auto border-b border-neutral-800 bg-[#0a0a0a] px-3">
                      <TabsList className="h-12 w-auto gap-5 bg-transparent">
                        {ep.responses.map((res, rIdx) => (
                          <TabsTrigger
                            key={rIdx}
                            value={res.status.toString()}
                            className="rounded-none px-1 transition-all data-[state=active]:border-b-2 data-[state=active]:border-neutral-200 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                          >
                            <span
                              className={`font-mono text-xs font-medium ${res.status >= 400 ? 'text-red-400' : 'text-neutral-300'}`}
                            >
                              {res.status} {res.label}
                            </span>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>

                    <div className="bg-[#000000] p-5">
                      {ep.responses.map((res, rIdx) => (
                        <TabsContent
                          key={rIdx}
                          value={res.status.toString()}
                          className="m-0 mt-0 focus-visible:ring-0"
                        >
                          <pre
                            className={`overflow-x-auto font-mono text-sm leading-relaxed ${res.status >= 400 ? 'text-red-400/90' : 'text-neutral-300'}`}
                          >
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
  )
}
