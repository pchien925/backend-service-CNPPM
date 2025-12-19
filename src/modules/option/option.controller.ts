import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';
import { CreateOptionDto } from './dtos/create-option.dto';
import { OptionQueryDto } from './dtos/option-query.dto';
import { OptionDto } from './dtos/option.dto';
import { UpdateOptionDto } from './dtos/update-option.dto';
import { OptionService } from './option.service';

@ApiTags('Option')
@ApiController('option', { auth: true })
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Post('create')
  @Permissions('OPT_C')
  @ApiOperation({ summary: 'Create new option' })
  async create(@Body() dto: CreateOptionDto): Promise<ApiResponse<void>> {
    await this.optionService.create(dto);
    return ApiResponse.successMessage('Option created successfully');
  }

  @Get('list')
  @Permissions('OPT_L')
  @ApiOperation({ summary: 'Get all options' })
  async findAll(
    @Query() query: OptionQueryDto,
  ): Promise<ApiResponse<ResponseListDto<OptionDto[]>>> {
    const options = await this.optionService.findAll(query);
    return ApiResponse.success(options, 'Get list options successfully');
  }

  @Get('get/:id')
  @Permissions('OPT_V')
  @ApiOperation({ summary: 'Get option detail (with values)' })
  async findOne(@Param('id') id: string): Promise<ApiResponse<OptionDto>> {
    const option = await this.optionService.findOne(id);
    return ApiResponse.success(option, 'Get option detail successfully');
  }

  @Put('update')
  @Permissions('OPT_U')
  @ApiOperation({ summary: 'Update an existing option' })
  async update(@Body() dto: UpdateOptionDto): Promise<ApiResponse<void>> {
    await this.optionService.update(dto);
    return ApiResponse.successMessage('Option updated successfully');
  }

  @Delete('delete/:id')
  @Permissions('OPT_D')
  @ApiOperation({ summary: 'Delete an option (soft delete)' })
  async delete(@Param('id') id: string): Promise<ApiResponse<void>> {
    await this.optionService.delete(id);
    return ApiResponse.successMessage('Option deleted successfully');
  }
}
