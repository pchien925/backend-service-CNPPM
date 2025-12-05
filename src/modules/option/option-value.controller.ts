import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { CreateOptionValueDto } from './dtos/create-option-value.dto';
import { OptionValueDto } from './dtos/option-value.dto';
import { UpdateOptionValueDto } from './dtos/update-option-value.dto';
import { OptionValueService } from './option-value.service';
import { OptionValueQueryDto } from './dtos/option-value-query.dto';

@ApiTags('Option Value')
@ApiController('option-value', { auth: true })
export class OptionValueController {
  constructor(private readonly optionValueService: OptionValueService) {}

  @Post('/create')
  @Permissions('OPV_C')
  @ApiOperation({ summary: 'Create new option value for a specific option' })
  async create(@Body() dto: CreateOptionValueDto): Promise<ApiResponse<void>> {
    await this.optionValueService.create(dto);
    return ApiResponse.successMessage('Option value created successfully');
  }

  @Get('/list')
  @Permissions('OPV_L')
  @ApiOperation({ summary: 'Get all option values for a specific option' })
  async findAllByOption(
    @Query() query: OptionValueQueryDto,
  ): Promise<ApiResponse<OptionValueDto[]>> {
    const values = await this.optionValueService.findAllByOption(query);
    return ApiResponse.success(values, 'Get list option values successfully');
  }

  @Get(':id')
  @Permissions('OPV_V')
  @ApiOperation({ summary: 'Get option value detail' })
  async findOne(@Param('id') id: number): Promise<ApiResponse<OptionValueDto>> {
    const value = await this.optionValueService.findOne(id);
    return ApiResponse.success(value, 'Get option value detail successfully');
  }

  @Put('/update')
  @Permissions('OPV_U')
  @ApiOperation({ summary: 'Update an existing option value' })
  async update(@Body() dto: UpdateOptionValueDto): Promise<ApiResponse<void>> {
    await this.optionValueService.update(dto);
    return ApiResponse.successMessage('Option value updated successfully');
  }

  @Delete(':id')
  @Permissions('OPV_D')
  @ApiOperation({ summary: 'Delete an option value (soft delete)' })
  async delete(@Param('id') id: number): Promise<ApiResponse<void>> {
    await this.optionValueService.delete(id);
    return ApiResponse.successMessage('Option value deleted successfully');
  }
}
