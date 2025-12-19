import { Body, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { ComboGroupService } from './combo-group.service';
import { ComboGroupDto } from './dtos/combo-group.dto';
import { CreateComboGroupDto } from './dtos/create-combo-group.dto';
import { UpdateComboGroupDto } from './dtos/update-combo-group.dto';
import { ComboGroupQueryDto } from './dtos/combo-group.query.dto';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';

@ApiTags('ComboGroup')
@ApiController('combo-group', { auth: true })
export class ComboGroupController {
  constructor(private readonly comboGroupService: ComboGroupService) {}

  @Post('create')
  @Permissions('COM_GR_C')
  @ApiOperation({ summary: 'Create new group for a combo (Combo ID is in Body)' })
  async create(@Body() dto: CreateComboGroupDto): Promise<ApiResponse<void>> {
    await this.comboGroupService.create(dto);
    return ApiResponse.successMessage('Combo group created successfully');
  }

  @Get('list')
  @Permissions('COM_GR_L')
  @ApiOperation({ summary: 'Get list of groups by Combo ID' })
  async findAllByCombo(
    @Query() query: ComboGroupQueryDto,
  ): Promise<ApiResponse<ResponseListDto<ComboGroupDto[]>>> {
    const groups = await this.comboGroupService.findAll(query);
    return ApiResponse.success(groups, 'Get list combo groups successfully');
  }

  @Get('get/:id')
  @Permissions('COM_GR_V')
  @ApiOperation({ summary: 'Get combo group detail' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the combo group' })
  async findOne(@Param('id', ParseIntPipe) id: string): Promise<ApiResponse<ComboGroupDto>> {
    const group = await this.comboGroupService.findOne(id);
    return ApiResponse.success(group, 'Get combo group detail successfully');
  }

  @Put('update')
  @Permissions('COM_GR_U')
  @ApiOperation({
    summary:
      'Update an existing combo group (Includes updating existing items and adding new items via body fields)',
  })
  async update(@Body() dto: UpdateComboGroupDto): Promise<ApiResponse<void>> {
    await this.comboGroupService.update(dto);
    return ApiResponse.successMessage('Combo group updated successfully');
  }

  @Delete('delete/:id')
  @Permissions('COM_GR_D')
  @ApiOperation({ summary: 'Delete a combo group (soft delete)' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the combo group to delete' })
  async delete(@Param('id', ParseIntPipe) id: string): Promise<ApiResponse<void>> {
    await this.comboGroupService.delete(id);
    return ApiResponse.successMessage('Combo group deleted successfully');
  }
}
