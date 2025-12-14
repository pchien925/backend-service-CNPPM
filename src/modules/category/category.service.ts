import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  STATUS_ACTIVE,
  STATUS_DELETE,
  STATUS_INACTIVE,
  STATUS_PENDING,
} from 'src/constants/app.constant';
import { ErrorCode } from 'src/constants/error-code.constant';
import { BadRequestException } from 'src/exception/bad-request.exception';
import { NotFoundException } from 'src/exception/not-found.exception';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { CategoryQueryDto } from './dtos/category-query.dto';
import { CategoryDto } from './dtos/category.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './entities/category.entity';
import { CategoryMapper } from './category.mapper';
import { CategorySpecification } from './specification/category.specification';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<void> {
    const { name, parentId } = dto;

    let parentCategory: Category | undefined;
    if (parentId) {
      parentCategory = await this.categoryRepo.findOneBy({
        id: parentId,
        status: STATUS_ACTIVE,
      });
      if (!parentCategory) {
        throw new NotFoundException(
          `Parent Category not found.`,
          ErrorCode.CATEGORY_ERROR_NOT_FOUND,
        );
      }
    }

    // 2. Check name thư mục nếu có parent thì check child
    const existingWhere: any = { name: ILike(name) };
    if (parentId) {
      existingWhere.parent = { id: parentId };
    } else {
      existingWhere.parent = IsNull();
    }

    const existingCategory = await this.categoryRepo.findOne({
      where: existingWhere,
    });

    if (existingCategory) {
      throw new BadRequestException(
        `Category name already exists for this parent.`,
        ErrorCode.CATEGORY_ERROR_NAME_EXISTS,
      );
    }

    const entity = CategoryMapper.toEntityFromCreate(dto);
    entity.parent = parentCategory;
    await this.categoryRepo.save(entity);
  }

  async findAll(query: CategoryQueryDto): Promise<CategoryDto[]> {
    const { page = 1, limit = 10 } = query;

    const filterSpec = new CategorySpecification(query);
    const where = filterSpec.toWhere();

    const entities = await this.categoryRepo.find({
      where,
      relations: ['parent'],
      order: { ordering: 'ASC', id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return CategoryMapper.toResponseList(entities);
  }

  async findOne(id: string): Promise<CategoryDto> {
    const entity = await this.categoryRepo.findOne({
      where: { id, status: Not(STATUS_DELETE) },
      relations: ['parent'],
    });
    if (!entity) {
      throw new NotFoundException(`Category not found.`, ErrorCode.CATEGORY_ERROR_NOT_FOUND);
    }
    return CategoryMapper.toResponse(entity);
  }

  async update(dto: UpdateCategoryDto): Promise<void> {
    const { id, parentId, name } = dto;

    const entity = await this.categoryRepo.findOneBy({
      id,
      status: Not(STATUS_DELETE),
    });
    if (!entity) {
      throw new NotFoundException(`Category not found.`, ErrorCode.CATEGORY_ERROR_NOT_FOUND);
    }

    let parentCategory: Category | null | undefined = entity.parent;

    if (parentId !== undefined) {
      if (parentId === null || parentId === null) {
        parentCategory = null;
      } else {
        parentCategory = await this.categoryRepo.findOneBy({
          id: parentId,
          status: STATUS_ACTIVE,
        });
        if (!parentCategory) {
          throw new NotFoundException(
            `Parent Category not found.`,
            ErrorCode.CATEGORY_ERROR_NOT_FOUND,
          );
        }
      }
    }

    if (name !== undefined && name !== entity.name) {
      const existingWhere: any = { name: ILike(name), id: Not(id) };
      const currentParentId = parentCategory?.id;

      if (currentParentId) {
        existingWhere.parent = { id: currentParentId };
      } else {
        existingWhere.parent = IsNull();
      }

      const existingCategory = await this.categoryRepo.findOne({
        where: existingWhere,
      });

      if (existingCategory) {
        throw new BadRequestException(
          `Category name already exists for this parent.`,
          ErrorCode.CATEGORY_ERROR_NAME_EXISTS,
        );
      }
    }

    const updatedEntity = CategoryMapper.toEntityFromUpdate(entity, dto);
    updatedEntity.parent = parentCategory;
    await this.categoryRepo.save(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    const categoryToDelete = await this.categoryRepo.findOneBy({
      id,
      status: Not(STATUS_DELETE),
    });

    if (!categoryToDelete) {
      throw new NotFoundException(`Category not found.`, ErrorCode.CATEGORY_ERROR_NOT_FOUND);
    }

    await this.recursiveSoftDelete(id);
  }

  private async recursiveSoftDelete(categoryId: string): Promise<void> {
    const children = await this.categoryRepo.find({
      where: { parent: { id: categoryId } },
      select: ['id'],
    });

    for (const child of children) {
      await this.recursiveSoftDelete(child.id);
    }

    await this.categoryRepo.update({ id: categoryId }, { status: STATUS_DELETE });
  }
}
