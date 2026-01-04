import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';
import { ComboService } from './combo.service';
import { ComboQueryDto } from './dtos/combo-query.dto';
import { ComboDto } from './dtos/combo.dto';
import { CreateComboDto } from './dtos/create-combo.dto';
import { UpdateComboDto } from './dtos/update-combo.dto';

@ApiTags('Combo')
@ApiController('combo', { auth: true })
export class ComboController {
  constructor(private readonly comboService: ComboService) {}

  @Post('create')
  @Permissions('COM_C')
  @ApiOperation({ summary: 'Create new combo' })
  async create(@Body() dto: CreateComboDto): Promise<ApiResponse<void>> {
    await this.comboService.create(dto);
    return ApiResponse.successMessage('Combo created successfully');
  }

  @Get('list')
  @Permissions('COM_L')
  @ApiOperation({ summary: 'Get list of combos (with filtering and pagination)' })
  async findAll(@Query() query: ComboQueryDto): Promise<ApiResponse<ResponseListDto<ComboDto[]>>> {
    const result = await this.comboService.findAll(query);
    return ApiResponse.success(result, 'Get list combos successfully');
  }

  @Get('get/:id')
  @Permissions('COM_V')
  @ApiOperation({ summary: 'Get combo detail' })
  async findOne(@Param('id') id: string): Promise<ApiResponse<ComboDto>> {
    const combo = await this.comboService.findOne(id);
    return ApiResponse.success(combo, 'Get combo detail successfully');
  }

  @Put('update')
  @Permissions('COM_U')
  @ApiOperation({ summary: 'Update an existing combo' })
  async update(@Body() dto: UpdateComboDto): Promise<ApiResponse<void>> {
    await this.comboService.update(dto);
    return ApiResponse.successMessage('Combo updated successfully');
  }

  @Delete('delete/:id')
  @Permissions('COM_D')
  @ApiOperation({ summary: 'Delete a combo (soft delete)' })
  async delete(@Param('id') id: string): Promise<ApiResponse<void>> {
    await this.comboService.delete(id);
    return ApiResponse.successMessage('Combo deleted successfully');
  }
}
