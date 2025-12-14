import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { STATUS_ACTIVE, STATUS_DELETE } from 'src/constants/app.constant';
import { ErrorCode } from 'src/constants/error-code.constant';
import { BadRequestException } from 'src/exception/bad-request.exception';
import { NotFoundException } from 'src/exception/not-found.exception';
import { Category } from 'src/modules/category/entities/category.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { DataSource, EntityManager, ILike, In, Not, Repository } from 'typeorm';
import { ComboMapper } from './combo.mapper';
import { ComboQueryDto } from './dtos/combo-query.dto';
import { ComboDto } from './dtos/combo.dto';
import { CreateComboDto } from './dtos/create-combo.dto';
import { UpdateComboDto } from './dtos/update-combo.dto';
import { ComboTag } from './entities/combo-tag.entity';
import { Combo } from './entities/combo.entity';
import { ComboSpecification } from './specification/combo.specification';

@Injectable()
export class ComboService {
  constructor(
    @InjectRepository(Combo)
    private readonly comboRepo: Repository<Combo>,
    @InjectRepository(ComboTag)
    private readonly comboTagRepo: Repository<ComboTag>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateComboDto): Promise<void> {
    const { name, categoryId, tagIds } = dto;

    const category = await this.categoryRepo.findOneBy({ id: categoryId, status: STATUS_ACTIVE });
    if (!category) {
      throw new NotFoundException(`Category not found.`, ErrorCode.CATEGORY_ERROR_NOT_FOUND);
    }

    const existingCombo = await this.comboRepo.findOne({
      where: {
        name: ILike(name),
        status: Not(STATUS_DELETE),
      },
    });
    if (existingCombo) {
      throw new BadRequestException(
        `Combo name already exists in this category.`,
        ErrorCode.COMBO_ERROR_NAME_EXISTS,
      );
    }
    if (tagIds !== undefined && tagIds.length > 0) {
      const tags = await this.tagRepo.findBy({ id: In(tagIds), status: STATUS_ACTIVE });
      if (tags.length !== tagIds.length) {
        throw new NotFoundException(
          `One or more tags not found or inactive.`,
          ErrorCode.TAG_ERROR_NOT_FOUND,
        );
      }
    }

    await this.dataSource.transaction(async (manager: EntityManager) => {
      const comboEntity = ComboMapper.toEntityFromCreate(dto);
      comboEntity.category = category;

      const savedCombo = await manager.save(comboEntity);

      if (tagIds !== undefined) {
        await this.syncComboTags(savedCombo, tagIds, manager);
      }
    });
  }

  async findAll(query: ComboQueryDto): Promise<ComboDto[]> {
    const { page = 1, limit = 10 } = query;
    const filterSpec = new ComboSpecification(query);
    const where = filterSpec.toWhere();

    const [entities] = await this.comboRepo.findAndCount({
      where,
      relations: ['category', 'comboTags.tag'],
      order: { ordering: 'ASC', id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return ComboMapper.toResponseList(entities);
  }

  async findOne(id: string): Promise<ComboDto> {
    const entity = await this.comboRepo.findOne({
      where: { id, status: Not(STATUS_DELETE) },
      relations: ['category', 'comboTags.tag'],
    });

    if (!entity) {
      throw new NotFoundException(`Combo not found.`, ErrorCode.COMBO_ERROR_NOT_FOUND);
    }

    return ComboMapper.toResponse(entity);
  }

  async update(dto: UpdateComboDto): Promise<void> {
    const { id, name, categoryId, tagIds } = dto;

    const entity = await this.comboRepo.findOne({
      where: { id, status: Not(STATUS_DELETE) },
      relations: ['category'],
    });

    if (!entity) {
      throw new NotFoundException(`Combo not found.`, ErrorCode.COMBO_ERROR_NOT_FOUND);
    }

    const currentCategoryId = entity.category.id;

    let newCategory: Category | undefined;
    if (categoryId !== undefined && categoryId !== currentCategoryId) {
      newCategory = await this.categoryRepo.findOneBy({ id: categoryId, status: STATUS_ACTIVE });
      if (!newCategory) {
        throw new NotFoundException(`Category not found.`, ErrorCode.CATEGORY_ERROR_NOT_FOUND);
      }
    }

    if (name !== undefined && name !== entity.name) {
      const existingCombo = await this.comboRepo.findOne({
        where: {
          name: ILike(name),
          id: Not(id),
        },
      });

      if (existingCombo) {
        throw new BadRequestException(
          `Combo name already exists in this category.`,
          ErrorCode.COMBO_ERROR_NAME_EXISTS,
        );
      }
    }

    if (tagIds !== undefined && tagIds.length > 0) {
      const tags = await this.tagRepo.findBy({ id: In(tagIds), status: STATUS_ACTIVE });
      if (tags.length !== tagIds.length) {
        throw new NotFoundException(
          `One or more tags not found or inactive.`,
          ErrorCode.TAG_ERROR_NOT_FOUND,
        );
      }
    }

    await this.dataSource.transaction(async (manager: EntityManager) => {
      const updatedEntity = ComboMapper.toEntityFromUpdate(entity, dto);

      if (newCategory) {
        updatedEntity.category = newCategory;
      }

      await manager.save(updatedEntity);

      if (tagIds !== undefined) {
        await this.syncComboTags(updatedEntity, tagIds, manager);
      }
    });
  }

  async delete(id: string): Promise<void> {
    const comboToDelete = await this.comboRepo.findOneBy({ id, status: Not(STATUS_DELETE) });

    if (!comboToDelete) {
      throw new NotFoundException(`Combo not found.`, ErrorCode.COMBO_ERROR_NOT_FOUND);
    }

    await this.comboRepo.update({ id }, { status: STATUS_DELETE });
  }

  private async syncComboTags(
    combo: Combo,
    newTagIds: string[],
    manager: EntityManager,
  ): Promise<void> {
    const comboTagRepo = manager.getRepository(ComboTag);
    const tagRepo = manager.getRepository(Tag);

    const currentComboTags = await comboTagRepo.find({
      where: { combo: { id: combo.id } },
      relations: ['tag'],
    });

    const currentTagIds = currentComboTags.map(ct => ct.tag.id);

    const tagsToDelete = currentComboTags.filter(ct => !newTagIds.includes(ct.tag.id));
    const tagIdsToAdd = newTagIds.filter(newId => !currentTagIds.includes(newId));

    if (tagsToDelete.length > 0) {
      const comboTagIdsToDelete = tagsToDelete.map(ct => ct.id);
      await comboTagRepo.delete(comboTagIdsToDelete);
    }

    if (tagIdsToAdd.length > 0) {
      const tagsToAdd = await tagRepo.findBy({ id: In(tagIdsToAdd), status: STATUS_ACTIVE });

      const newComboTags = tagsToAdd.map(tag => {
        const comboTag = new ComboTag();
        comboTag.combo = combo;
        comboTag.tag = tag;
        return comboTag;
      });
      await comboTagRepo.save(newComboTags);
    }
  }
}
