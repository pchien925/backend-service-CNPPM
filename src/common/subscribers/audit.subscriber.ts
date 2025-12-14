import { Injectable } from '@nestjs/common';
import { Auditable } from 'src/database/entities/abstract.entity';
import { UserContextHelper } from 'src/shared/context/user-context.helper';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@Injectable()
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface<Auditable<any>> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Auditable;
  }

  beforeInsert(event: InsertEvent<Auditable<any>>) {
    const username = UserContextHelper.getUsername() ?? 'system';

    if (!event.entity.createdBy) {
      event.entity.createdBy = username;
    }
    if (!event.entity.modifiedBy) {
      event.entity.modifiedBy = username;
    }
  }

  beforeUpdate(event: UpdateEvent<Auditable<any>>) {
    const username = UserContextHelper.getUsername() ?? 'system';

    event.entity.modifiedBy = username;
  }
}
