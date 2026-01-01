import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { CreateFoodOptionDto } from './dtos/create-food-optiondto';
import { FoodOptionQueryDto } from './dtos/food-option-query.dto';
import { FoodOptionSortItemDto } from './dtos/food-option-sort.dto';
import { UpdateFoodOptionDto } from './dtos/update-food-optiondto';
import { FoodOptionService } from './food-option.service';

@ApiTags('Food Option')
@ApiController('food-option', { auth: true })
export class FoodOptionController {
  constructor(private readonly service: FoodOptionService) {}

  @Post('create')
  @Permissions('FOOD_U')
  async create(@Body() dto: CreateFoodOptionDto) {
    await this.service.create(dto);
    return ApiResponse.successMessage('Created successfully');
  }

  @Get('list')
  @Permissions('FOOD_L')
  @ApiOperation({ summary: 'Get list of Food Options with filtering' })
  async findAll(@Query() query: FoodOptionQueryDto) {
    const result = await this.service.findAll(query);
    return ApiResponse.success(result, 'Get list successfully');
  }

  @Get('get/:id')
  @Permissions('FOOD_V')
  async findOne(@Param('id') id: string) {
    const result = await this.service.findOne(id);
    return ApiResponse.success(result, 'Get detail successfully');
  }

  @Put('update')
  @Permissions('FOOD_U')
  async update(@Body() dto: UpdateFoodOptionDto) {
    await this.service.update(dto);
    return ApiResponse.successMessage('Updated successfully');
  }

  @Put('update-sort')
  @Permissions('FOOD_U')
  @ApiOperation({ summary: 'Update food options ordering' })
  async updateSort(@Body() dto: FoodOptionSortItemDto[]): Promise<ApiResponse<void>> {
    await this.service.updateSort(dto);
    return ApiResponse.successMessage('Update order successfully');
  }

  @Delete('delete/:id')
  @Permissions('FOOD_D')
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
    return ApiResponse.successMessage('Deleted successfully');
  }
}
