import { Body, Delete, Get, Param, Post, Put, Query, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { ComboService } from './combo.service';
import { ComboQueryDto } from './dtos/combo-query.dto';
import { ComboDto } from './dtos/combo.dto';
import { CreateComboDto } from './dtos/create-combo.dto';
import { UpdateComboDto } from './dtos/update-combo.dto';

@ApiTags('Combo')
@ApiController('combo', { auth: true })
export class ComboController {
  constructor(private readonly comboService: ComboService) {}

  @Post()
  @Permissions('COMBO_C')
  @ApiOperation({ summary: 'Create new combo' })
  async create(@Body() dto: CreateComboDto): Promise<ApiResponse<void>> {
    await this.comboService.create(dto);
    return ApiResponse.successMessage('Combo created successfully');
  }

  @Get()
  @Permissions('COMBO_L')
  @ApiOperation({ summary: 'Get list of combos (with filtering and pagination)' })
  async findAll(@Query() query: ComboQueryDto): Promise<ApiResponse<ComboDto[]>> {
    const combos = await this.comboService.findAll(query);
    return ApiResponse.success(combos, 'Get list combos successfully');
  }

  @Get(':id')
  @Permissions('COMBO_V')
  @ApiOperation({ summary: 'Get combo detail' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<ComboDto>> {
    const combo = await this.comboService.findOne(id);
    return ApiResponse.success(combo, 'Get combo detail successfully');
  }

  @Put()
  @Permissions('COMBO_U')
  @ApiOperation({ summary: 'Update an existing combo' })
  async update(@Body() dto: UpdateComboDto): Promise<ApiResponse<void>> {
    await this.comboService.update(dto);
    return ApiResponse.successMessage('Combo updated successfully');
  }

  @Delete(':id')
  @Permissions('COMBO_D')
  @ApiOperation({ summary: 'Delete a combo (soft delete)' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<void>> {
    await this.comboService.delete(id);
    return ApiResponse.successMessage('Combo deleted successfully');
  }
}
