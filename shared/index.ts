export const __SIX_HOURS_MS = 6 * 60 * 60 * 1000

export const __SERVER_HEALTH_CHECK_TABLE = {
  admin: {
    schema: 'admin',
    usageLog: 'usage_logs_kst',
    accountLog: 'account_logs',
  },
  public: {
    schema: 'public',
    dbSizeView: 'admin_db_size',
    dummyTable: 'unexist_table_only_for_request_health_check',
  },
} as const


export const __SUBWAY_LINE_TABLE = {
  name: 'subway_lines',
  schema: 'public',
} as const

export const __SUBWAY_STATION_TABLE = {
  name: 'subway_stations',
  schema: 'public',
} as const

export const __LOCATION_TABLE = {
  name: 'locations',
  schema: 'public',
} as const