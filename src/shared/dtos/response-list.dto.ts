import { ApiProperty } from '@nestjs/swagger';

export class ResponseListDto<T> {
  @ApiProperty()
  content: T;

  @ApiProperty()
  totalElements: number;

  @ApiProperty()
  totalPages: number;

  constructor(content: T, totalElements: number, pageSize: number) {
    this.content = content;
    this.totalElements = totalElements;
    this.totalPages = Math.ceil(totalElements / pageSize) || 1;
  }
}
