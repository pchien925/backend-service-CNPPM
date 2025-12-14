import { SnowFlakeIdService } from './snowflake-id.service';

export interface ValueGenerator {
  generate(entity: any): any;
}

export class SnowflakeValueGenerator implements ValueGenerator {
  generate(entity: any): any {
    try {
      const reuseId = entity.reusedId;
      if (reuseId != null) {
        return reuseId;
      }
    } catch (e) {
      // ignore
    }
    return SnowFlakeIdService.getInstance().nextId();
  }
}
