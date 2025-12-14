export enum Environment {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test',
}

export const DEFAULT_PAGE_LIMIT = 10;
export const DEFAULT_CURRENT_PAGE = 1;

export const STATUS_ACTIVE = 1;
export const STATUS_PENDING = 0;
export const STATUS_INACTIVE = -1;
export const STATUS_DELETE = -2;
