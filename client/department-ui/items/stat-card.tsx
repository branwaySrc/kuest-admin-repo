"use client"

import { IconLabel } from "../ui/icon-label";
import { Database,Server, type LucideIcon } from "lucide-react";

interface StatCardProps {
   firstrow:StatValue,
   secondrow:StatValue
}

type StatValue = {
    title: string;
    value: string;
}

export default function StatCard(props: StatCardProps) {
  return (
    <div className="border-border bg-white/5 hover:bg-card/60 hover:shadow-primary/5 group rounded-lg border p-3 transition-all hover:shadow-lg">
      <Stat icon={Database} title={props.firstrow.title} value={props.firstrow.value}/>
      <BottomLine/>
      <Stat color="text-amber-400" icon={Server} title={props.secondrow.title} value={props.secondrow.value}/>
    </div>
  )
}

function Stat(props:{icon:LucideIcon,title:string,value:string, color?:string}) {
  return (
    <section className="flex items-center justify-between">
      <div className={`${props.color? props.color : "text-muted-foreground/70"} text-xs tracking-wider uppercase transition-colors`}>
        <IconLabel iconClassName={props.color} icon={props.icon} iconSize={13}>{props.title}</IconLabel>
      </div>
      <div className={`${props.color} text-xs font-extrabold tracking-tight`}>{props.value}</div>
    </section>
  )
}

function BottomLine () {
  return (
    <div className="border-b my-3"/>
  )
}