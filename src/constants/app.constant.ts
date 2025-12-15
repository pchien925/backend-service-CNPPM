export enum Environment {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test',
}

export const DEFAULT_PAGE_LIMIT = 20;
export const DEFAULT_CURRENT_PAGE = 0;

export const STATUS_ACTIVE = 1;
export const STATUS_PENDING = 0;
export const STATUS_INACTIVE = -1;
export const STATUS_DELETE = -2;

export const NATION_KIND_WARD = 1;
export const NATION_KIND_DISTRICT = 2;
export const NATION_KIND_PROVINCE = 3;
