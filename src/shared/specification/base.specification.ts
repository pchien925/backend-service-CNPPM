import { FindOptionsWhere } from 'typeorm';

export abstract class BaseSpecification<T> {
  abstract toWhere(): FindOptionsWhere<T>;
}
