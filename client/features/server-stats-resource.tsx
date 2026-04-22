import StatCard from "@/client/department-ui/items/stat-card"

function TotalLines() {
    return (
        <StatCard firstrow={{title:"등록된 전체 호선", value:"50"}} secondrow={{title:"활성화 된 호선", value:"30"}} />
    )
}


function TotalStation(){
    return (
        <StatCard firstrow={{title:"등록된 전체 역", value:"50"}} secondrow={{title:"활성화 된 역", value:"30"}} />
    )
}



function TotalPublicSectors(){
    return (
        <StatCard firstrow={{title:"등록된 전체 장소 (Public)", value:"50"}} secondrow={{title:"활성화 된 장소 (Public)", value:"30"}} />
    )
}

function TotalPrivateSectors(){
    return (
        <StatCard firstrow={{title:"등록된 전체 장소 (Private)", value:"50"}} secondrow={{title:"활성화 된 장소 (Private)", value:"30"}} />
    )
}




export const StatsResource = {
    Lines:TotalLines ,
    Stations:TotalStation,
    Public:TotalPublicSectors,
    Private:TotalPrivateSectors
}

