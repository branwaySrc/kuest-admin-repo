"use client"

import { Folder } from "lucide-react";
import { IconLabel } from "./department-ui/ui/icon-label";
import { StatsResource } from "./features/server-stats-resource";
import { Badge } from "./department-ui/ui/badge";

export default function DashboardStatViewer() {
  return (
    <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-4 px-4">
      <UI.StatBlock
        title="Rails">
        <StatsResource.Lines />
      </UI.StatBlock>
      <UI.StatBlock
        title="Stations">
        <StatsResource.Stations />
      </UI.StatBlock>
      <UI.StatBlock
        title="Public">
        <StatsResource.Public />
      </UI.StatBlock>
      <UI.StatBlock
        title="Private">
        <StatsResource.Private />
      </UI.StatBlock>
    </div>
  )
}

const UI = {
  StatBlock: StatBlock
}


function StatBlock(props: { title: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <IconLabel icon={Folder} iconSize={15} className="text-xs font-mono gap-2 ml-1">{props.title}</IconLabel>
        <Badge variant="secondary" className="font-mono text-[10px]">GET</Badge>
      </div>
      {props.children}
    </div>
  )
}