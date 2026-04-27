import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/client/department-ui/ui/input-group";
import { useDatabaseFilterStore } from "@/client/department-feature/store/use-database-filter-store";

interface SearchFieldProps {
    result? : string | number
}

export function StationSearchField(props:SearchFieldProps) {
  const searchQuery = useDatabaseFilterStore(s => s.searchQuery)
  const setSearchQuery = useDatabaseFilterStore(s => s.setSearchQuery)

  return (
     <InputGroup className="max-w-xs h-10 px-1">
      <InputGroupInput 
        placeholder="Search station name..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">{props.result? `${props.result} results`: null}</InputGroupAddon>
    </InputGroup>
  )
}
