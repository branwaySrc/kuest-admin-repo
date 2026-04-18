enum StationLineUniqueCodeCategory {
    METRO = 'metro',
    COMMUTER_RAIL = 'commuter_rail',
    LIGHT_RAIL = 'light_rail',
    EXPRESS_RAIL = 'express_rail',
}

enum StationLineUniqueCodeOperator {
    SEOUL_METRO = 'seoul_metro',
    KORAIL = 'korail',
    INCHEON = 'incheon',
    PRIVATE = 'private',
}

type StationLineUniqueCode = {
  id: string
  name: string
  category: StationLineUniqueCodeCategory
  operator: StationLineUniqueCodeOperator
}

const 도시철도 = [
    '1호선',
    '2호선',
    '3호선',
    '4호선',
    '5호선',
    '6호선',
    '7호선',
    '8호선',
    '9호선',
]

const 광역철도 = [
    '경의중앙선',
    '수인분당선',
    '신분당선',
    '공항철도',
    '경춘선',
    '경강선',
]

const 경전철 = [
    '인천1호선',
    '인천2호선',
    '우이신설선',
    '신림선',
    '김포골드라인',
    '용인경전철',
    '의정부경전철',
    '에버라인',
    '신안산선',
    '서해선',
]

const 고속철도 = [
    'GTX-A',
    'GTX-B',
    'GTX-C',
]


export const stationLineUniqueCodeBook: Record<string, StationLineUniqueCode> = {
    '1호선': {
        id: '1호선',
        name: '1호선',
        category: StationLineUniqueCodeCategory.METRO,
        operator: StationLineUniqueCodeOperator.SEOUL_METRO,
    },
    '2호선': {
        id: '2호선',
        name: '2호선',
        category: StationLineUniqueCodeCategory.METRO,
        operator: StationLineUniqueCodeOperator.SEOUL_METRO,
    },
    '3호선': {
        id: '3호선',
        name: '3호선',
        category: StationLineUniqueCodeCategory.METRO,
        operator: StationLineUniqueCodeOperator.SEOUL_METRO,
    },
    '4호선': {
        id: '4호선',
        name: '4호선',
        category: StationLineUniqueCodeCategory.METRO,
        operator: StationLineUniqueCodeOperator.SEOUL_METRO,
    },
    '5호선': {
        id: '5호선',
        name: '5호선',
        category: StationLineUniqueCodeCategory.METRO,
        operator: StationLineUniqueCodeOperator.SEOUL_METRO,
    },
    '6호선': {
        id: '6호선',
        name: '6호선',
        category: StationLineUniqueCodeCategory.METRO,
        operator: StationLineUniqueCodeOperator.SEOUL_METRO,
    },
    '7호선': {
        id: '7호선',
        name: '7호선',
        category: StationLineUniqueCodeCategory.METRO,
        operator: StationLineUniqueCodeOperator.SEOUL_METRO,
    },
    '8호선': {
        id: '8호선',
        name: '8호선',
        category: StationLineUniqueCodeCategory.METRO,
        operator: StationLineUniqueCodeOperator.SEOUL_METRO,
    },
    '9호선': {
        id: '9호선',
        name: '9호선',
        category: StationLineUniqueCodeCategory.METRO,
        operator: StationLineUniqueCodeOperator.SEOUL_METRO,
    },
    '경의중앙선': {
        id: '경의중앙선',
        name: '경의중앙선',
        category: StationLineUniqueCodeCategory.COMMUTER_RAIL,
        operator: StationLineUniqueCodeOperator.KORAIL,
    },
    '수인분당선': {
        id: '수인분당선',
        name: '수인분당선',
        category: StationLineUniqueCodeCategory.COMMUTER_RAIL,
        operator: StationLineUniqueCodeOperator.KORAIL,
    },
    '신분당선': {
        id: '신분당선',
        name: '신분당선',
        category: StationLineUniqueCodeCategory.COMMUTER_RAIL,
        operator: StationLineUniqueCodeOperator.PRIVATE,
    },
    '공항철도': {
        id: '공항철도',
        name: '공항철도',
        category: StationLineUniqueCodeCategory.COMMUTER_RAIL,
        operator: StationLineUniqueCodeOperator.KORAIL,
    },
    '경춘선': {
        id: '경춘선',
        name: '경춘선',
        category: StationLineUniqueCodeCategory.COMMUTER_RAIL,
        operator: StationLineUniqueCodeOperator.KORAIL,
    },
    '경강선': {
        id: '경강선',
        name: '경강선',
        category: StationLineUniqueCodeCategory.COMMUTER_RAIL,
        operator: StationLineUniqueCodeOperator.KORAIL,
    },
    '인천1호선': {
        id: '인천1호선',
        name: '인천1호선',
        category: StationLineUniqueCodeCategory.LIGHT_RAIL,
        operator: StationLineUniqueCodeOperator.INCHEON,
    },
    '인천2호선': {
        id: '인천2호선',
        name: '인천2호선',
        category: StationLineUniqueCodeCategory.LIGHT_RAIL,
        operator: StationLineUniqueCodeOperator.INCHEON,
    },
    '우이신설선': {
        id: '우이신설선',
        name: '우이신설선',
        category: StationLineUniqueCodeCategory.LIGHT_RAIL,
        operator: StationLineUniqueCodeOperator.PRIVATE,
    },
    '신림선': {
        id: '신림선',
        name: '신림선',
        category: StationLineUniqueCodeCategory.LIGHT_RAIL,
        operator: StationLineUniqueCodeOperator.PRIVATE,
    },
    '김포골드라인': {
        id: '김포골드라인',
        name: '김포골드라인',
        category: StationLineUniqueCodeCategory.LIGHT_RAIL,
        operator: StationLineUniqueCodeOperator.PRIVATE,
    },
    '용인경전철': {
        id: '용인경전철',
        name: '용인경전철',
        category: StationLineUniqueCodeCategory.LIGHT_RAIL,
        operator: StationLineUniqueCodeOperator.PRIVATE,
    },
    '의정부경전철': {
        id: '의정부경전철',
        name: '의정부경전철',
        category: StationLineUniqueCodeCategory.LIGHT_RAIL,
        operator: StationLineUniqueCodeOperator.PRIVATE,
    },
    '에버라인': {
        id: '에버라인',
        name: '에버라인',
        category: StationLineUniqueCodeCategory.LIGHT_RAIL,
        operator: StationLineUniqueCodeOperator.PRIVATE,
    },
    '신안산선': {
        id: '신안산선',
        name: '신안산선',
        category: StationLineUniqueCodeCategory.LIGHT_RAIL,
        operator: StationLineUniqueCodeOperator.PRIVATE,
    },
    '서해선': {
        id: '서해선',
        name: '서해선',
        category: StationLineUniqueCodeCategory.LIGHT_RAIL,
        operator: StationLineUniqueCodeOperator.PRIVATE,
    },
    'GTX-A': {
        id: 'GTX-A',
        name: 'GTX-A',
        category: StationLineUniqueCodeCategory.EXPRESS_RAIL,
        operator: StationLineUniqueCodeOperator.KORAIL,
    },
    'GTX-B': {
        id: 'GTX-B',
        name: 'GTX-B',
        category: StationLineUniqueCodeCategory.EXPRESS_RAIL,
        operator: StationLineUniqueCodeOperator.KORAIL,
    },
    'GTX-C': {
        id: 'GTX-C',
        name: 'GTX-C',
        category: StationLineUniqueCodeCategory.EXPRESS_RAIL,
        operator: StationLineUniqueCodeOperator.KORAIL,
    },
}
