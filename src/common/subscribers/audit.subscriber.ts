import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Auditable } from 'src/database/entities/abstract.entity';
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
  constructor(
    dataSource: DataSource,
    private readonly cls: ClsService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Auditable;
  }

  beforeInsert(event: InsertEvent<Auditable<any>>) {
    const user = this.cls.get('user');
    const username = user ? user.username : 'system';

    if (!event.entity.createdBy) {
      event.entity.createdBy = username;
    }
    if (!event.entity.modifiedBy) {
      event.entity.modifiedBy = username;
    }
  }

  beforeUpdate(event: UpdateEvent<Auditable<any>>) {
    const user = this.cls.get('user');
    const username = user ? user.username : 'system';

    event.entity.modifiedBy = username;
  }
}
