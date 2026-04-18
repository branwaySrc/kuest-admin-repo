export default function OverviewAppListedViewer() {
    return (
        <div className="border border-white">
            <h1>OverviewAppListedViewer</h1>
        </div>
    );
}

// export default funcion에는 condition을 넣는곳이고
// function으로 type을 overview / expanded 로 구분해서, overview는 dashboard에 넣고 expanded는 database page에 넣자
// 이러한 패턴으로 block을 만들면, tile은 글로벌과 같은 UI가 꽉차있는거고, block은 UI가 특정 page에 귀속되어 보여지는거다.