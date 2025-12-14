import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { CreateFoodDto } from './dtos/create-food.dto';
import { FoodQueryDto } from './dtos/food-query.dto';
import { FoodDto } from './dtos/food.dto';
import { UpdateFoodDto } from './dtos/update-food.dto';
import { FoodService } from './food.service';

@ApiTags('Food')
@ApiController('food', { auth: true })
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post('/create')
  @Permissions('FOOD_C')
  @ApiOperation({ summary: 'Create new food item with tags and options' })
  async create(@Body() dto: CreateFoodDto): Promise<ApiResponse<void>> {
    await this.foodService.create(dto);
    return ApiResponse.successMessage('Food created successfully');
  }

  @Get('/list')
  @Permissions('FOOD_L')
  @ApiOperation({ summary: 'Get list of Foods with filtering and pagination' })
  async findAll(@Query() query: FoodQueryDto): Promise<ApiResponse<FoodDto[]>> {
    const foods = await this.foodService.findAll(query);
    return ApiResponse.success(foods, 'Get list Foods successfully');
  }

  @Get(':id')
  @Permissions('FOOD_V')
  @ApiOperation({ summary: 'Get food detail with all related tags and options' })
  async findOne(@Param('id') id: string): Promise<ApiResponse<FoodDto>> {
    const food = await this.foodService.findOne(id);
    return ApiResponse.success(food, 'Get food detail successfully');
  }

  @Put('/update')
  @Permissions('FOOD_U')
  @ApiOperation({ summary: 'Update an existing food item (tags and options are synchronized)' })
  async update(@Body() dto: UpdateFoodDto): Promise<ApiResponse<void>> {
    await this.foodService.update(dto);
    return ApiResponse.successMessage('Food updated successfully');
  }

  @Delete(':id')
  @Permissions('FOOD_D')
  @ApiOperation({ summary: 'Delete a food item (soft delete)' })
  async delete(@Param('id') id: string): Promise<ApiResponse<void>> {
    await this.foodService.delete(id);
    return ApiResponse.successMessage('Food deleted successfully');
  }
}
