import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { STATUS_ACTIVE, STATUS_DELETE } from 'src/constants/app.constant';
import { ErrorCode } from 'src/constants/error-code.constant';
import { BadRequestException } from 'src/exception/bad-request.exception';
import { NotFoundException } from 'src/exception/not-found.exception';
import { ILike, Not, Repository } from 'typeorm';
import { CreateTagDto } from './dtos/create-tag.dto';
import { TagQueryDto } from './dtos/tag-query.dto';
import { TagDto } from './dtos/tag.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { TagSpecification } from './specification/tag.specification';
import { TagMapper } from './tag.mapper';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  async create(dto: CreateTagDto): Promise<void> {
    const existingTag = await this.tagRepo.findOne({
      where: { name: ILike(dto.name) },
    });

    if (existingTag) {
      throw new BadRequestException(`Tag name already exists.`, ErrorCode.TAG_ERROR_NAME_EXISTS);
    }

    const entity = TagMapper.toEntityFromCreate(dto);
    await this.tagRepo.save(entity);
  }

  async findAll(query: TagQueryDto): Promise<ResponseListDto<TagDto[]>> {
    const { page = 0, limit = 10 } = query;

    const filterSpec = new TagSpecification(query);
    const where = filterSpec.toWhere();

    const [entities, totalElements] = await this.tagRepo.findAndCount({
      where,
      order: { id: 'ASC' },
      skip: page * limit,
      take: limit,
    });

    const content = TagMapper.toResponseList(entities);
    return new ResponseListDto(content, totalElements, limit);
  }

  async findOne(id: string): Promise<TagDto> {
    const entity = await this.tagRepo.findOneBy({ id, status: STATUS_ACTIVE });
    if (!entity) {
      throw new NotFoundException(`Tag not found.`, ErrorCode.TAG_ERROR_NOT_FOUND);
    }
    return TagMapper.toResponse(entity);
  }

  async update(dto: UpdateTagDto): Promise<void> {
    const entity = await this.tagRepo.findOneBy({ id: dto.id, status: 1 });
    if (!entity) {
      throw new NotFoundException(`Tag not found.`, ErrorCode.TAG_ERROR_NOT_FOUND);
    }

    // Kiểm tra tên Tag nếu tên bị thay đổi
    if (dto.name !== undefined && dto.name !== entity.name) {
      const existingTag = await this.tagRepo.findOne({
        where: { name: ILike(dto.name), id: Not(dto.id) },
      });

      if (existingTag && existingTag.id !== entity.id) {
        throw new BadRequestException(`Tag name already exists.`, ErrorCode.TAG_ERROR_NAME_EXISTS);
      }
    }

    const updatedEntity = TagMapper.toEntityFromUpdate(entity, dto);
    await this.tagRepo.save(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    const result = await this.tagRepo.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException('Tag not found.', ErrorCode.TAG_ERROR_NOT_FOUND);
    }
  }
}
