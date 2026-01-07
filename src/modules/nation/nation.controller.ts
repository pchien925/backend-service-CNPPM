import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { CreateNationDto } from './dtos/create-nation.dto';
import { NationQueryDto } from './dtos/nation-query.dto';
import { NationDto } from './dtos/nation.dto';
import { UpdateNationDto } from './dtos/update-nation.dto';
import { NationService } from './nation.service';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';

@ApiTags('Nation')
@ApiController('nation', { auth: true })
export class NationController {
  constructor(private readonly nationService: NationService) {}

  @Post('create')
  @Permissions('NAT_C')
  @ApiOperation({ summary: 'Create new geographic unit (Province, District, Ward)' })
  async create(@Body() dto: CreateNationDto): Promise<ApiResponse<void>> {
    await this.nationService.create(dto);
    return ApiResponse.successMessage('Nation created successfully');
  }

  @Get('list')
  @Permissions('NAT_L')
  @ApiOperation({ summary: 'Get list of geographic units' })
  async findAll(
    @Query() query: NationQueryDto,
  ): Promise<ApiResponse<ResponseListDto<NationDto[]>>> {
    const result = await this.nationService.findAll(query);
    return ApiResponse.success(result, 'Get list nations successfully');
  }

  @Get('/auto-complete')
  @ApiOperation({ summary: 'Get list of geographic units' })
  async autoComplete(
    @Query() query: NationQueryDto,
  ): Promise<ApiResponse<ResponseListDto<NationDto[]>>> {
    const result = await this.nationService.autoComplete(query);
    return ApiResponse.success(result, 'Get list nations successfully');
  }

  @Get('get/:id')
  @Permissions('NAT_V')
  @ApiOperation({ summary: 'Get geographic unit detail' })
  async findOne(@Param('id') id: string): Promise<ApiResponse<NationDto>> {
    const nation = await this.nationService.findOne(id);
    return ApiResponse.success(nation, 'Get nation detail successfully');
  }

  @Put('update')
  @Permissions('NAT_U')
  @ApiOperation({ summary: 'Update an existing geographic unit' })
  async update(@Body() dto: UpdateNationDto): Promise<ApiResponse<void>> {
    await this.nationService.update(dto);
    return ApiResponse.successMessage('Nation updated successfully');
  }

  @Delete('delete/:id')
  @Permissions('NAT_D')
  @ApiOperation({ summary: 'Delete a geographic unit (soft delete, applies to children too)' })
  async delete(@Param('id') id: string): Promise<ApiResponse<void>> {
    await this.nationService.delete(id);
    return ApiResponse.successMessage('Nation deleted successfully');
  }
}
