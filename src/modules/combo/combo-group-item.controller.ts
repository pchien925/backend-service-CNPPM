import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';
import { ComboGroupItemService } from './combo-group-item.service';
import { ComboGroupItemSortDto } from './dtos/combo-group-item-sort.dto';
import { ComboGroupItemDto } from './dtos/combo-group-item.dto';
import { ComboGroupItemQueryDto } from './dtos/combo-group-item.query.dto';
import { CreateComboGroupItemDto } from './dtos/create-combo-group-item.dto';
import { UpdateComboGroupItemDto } from './dtos/update-combo-group-item.dto';

@ApiTags('Combo Group Item')
@ApiController('combo-group-item', { auth: true })
export class ComboGroupItemController {
  constructor(private readonly itemService: ComboGroupItemService) {}

  @Post('create')
  @Permissions('COM_GR_U')
  @ApiOperation({ summary: 'Add a food to combo group' })
  async create(@Body() dto: CreateComboGroupItemDto): Promise<ApiResponse<void>> {
    await this.itemService.create(dto);
    return ApiResponse.successMessage('Food added to group successfully');
  }

  @Get('list')
  @Permissions('COM_V')
  @ApiOperation({ summary: 'Get list items within a specific group' })
  async findAll(
    @Query() query: ComboGroupItemQueryDto,
  ): Promise<ApiResponse<ResponseListDto<ComboGroupItemDto[]>>> {
    const result = await this.itemService.findAll(query);
    return ApiResponse.success(result, 'Get list combo group items successfully');
  }

  @Put('update')
  @Permissions('COM_GR_U')
  @ApiOperation({ summary: 'Update item (extra price or ordering)' })
  async update(@Body() dto: UpdateComboGroupItemDto): Promise<ApiResponse<void>> {
    await this.itemService.update(dto);
    return ApiResponse.successMessage('Item updated successfully');
  }

  @Put('update-sort')
  @Permissions('COM_GR_U')
  @ApiOperation({ summary: 'Sort items within a group' })
  async updateSort(@Body() data: ComboGroupItemSortDto[]): Promise<ApiResponse<void>> {
    await this.itemService.updateSort(data);
    return ApiResponse.successMessage('Items sorted successfully');
  }

  @Delete(':id')
  @Permissions('COM_GR_U')
  @ApiOperation({ summary: 'Remove a food from combo group' })
  async delete(@Param('id') id: string): Promise<ApiResponse<void>> {
    await this.itemService.delete(id);
    return ApiResponse.successMessage('Food removed from group successfully');
  }
}
