import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { CategoryService } from './category.service';
import { CategoryQueryDto } from './dtos/category-query.dto';
import { CategoryDto } from './dtos/category.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@ApiTags('Category')
@ApiController('category', { auth: true })
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @Permissions('CAT_C')
  @ApiOperation({ summary: 'Create new category' })
  async create(@Body() dto: CreateCategoryDto): Promise<ApiResponse<void>> {
    await this.categoryService.create(dto);
    return ApiResponse.successMessage('Category created successfully');
  }

  @Get('/list')
  @Permissions('CAT_L')
  @ApiOperation({ summary: 'Get list of categories (with filtering and pagination)' })
  async findAll(@Query() query: CategoryQueryDto): Promise<ApiResponse<CategoryDto[]>> {
    const categories = await this.categoryService.findAll(query);
    return ApiResponse.success(categories, 'Get list categories successfully');
  }

  @Get(':id')
  @Permissions('CAT_V')
  @ApiOperation({ summary: 'Get category detail' })
  async findOne(@Param('id') id: number): Promise<ApiResponse<CategoryDto>> {
    const category = await this.categoryService.findOne(id);
    return ApiResponse.success(category, 'Get category detail successfully');
  }

  @Put('/update')
  @Permissions('CAT_U')
  @ApiOperation({ summary: 'Update an existing category' })
  async update(@Body() dto: UpdateCategoryDto): Promise<ApiResponse<void>> {
    await this.categoryService.update(dto);
    return ApiResponse.successMessage('Category updated successfully');
  }

  @Delete(':id')
  @Permissions('CAT_D')
  @ApiOperation({ summary: 'Delete a category (soft delete, applies to children too)' })
  async delete(@Param('id') id: number): Promise<ApiResponse<void>> {
    await this.categoryService.delete(id);
    return ApiResponse.successMessage('Category deleted successfully');
  }
}
