import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';
import { BranchService } from './branch.service';
import { BranchQueryDto } from './dtos/branch-query.dto';
import { BranchDto } from './dtos/branch.dto';
import { CreateBranchDto } from './dtos/create-branch.dto';
import { UpdateBranchDto } from './dtos/update-branch.dto';

@ApiTags('Branch')
@ApiController('branch', { auth: true })
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post('create')
  @Permissions('BR_C')
  @ApiOperation({ summary: 'Create new Branch' })
  async create(@Body() dto: CreateBranchDto): Promise<ApiResponse<void>> {
    await this.branchService.create(dto);
    return ApiResponse.successMessage('Branch created successfully');
  }

  @Get('list')
  @Permissions('BR_L')
  @ApiOperation({ summary: 'Get list of all Branches' })
  async findAll(
    @Query() query: BranchQueryDto,
  ): Promise<ApiResponse<ResponseListDto<BranchDto[]>>> {
    const result = await this.branchService.findAll(query);
    return ApiResponse.success(result, 'Get list Branches successfully');
  }

  @Get('auto-complete')
  @ApiOperation({ summary: 'Get auto complete of Branches' })
  async autoComplete(
    @Query() query: BranchQueryDto,
  ): Promise<ApiResponse<ResponseListDto<BranchDto[]>>> {
    const result = await this.branchService.autoComplete(query);
    return ApiResponse.success(result, 'Get auto complete branches successfully');
  }

  @Get('get/:id')
  @Permissions('BR_V')
  @ApiOperation({ summary: 'Get Branch detail' })
  async findOne(@Param('id') id: string): Promise<ApiResponse<BranchDto>> {
    const branch = await this.branchService.findOne(id);
    return ApiResponse.success(branch, 'Get Branch detail successfully');
  }

  @Put('update')
  @Permissions('BR_U')
  @ApiOperation({ summary: 'Update an existing Branch' })
  async update(@Body() dto: UpdateBranchDto): Promise<ApiResponse<void>> {
    await this.branchService.update(dto);
    return ApiResponse.successMessage('Branch updated successfully');
  }

  @Delete('/delete/:id')
  @Permissions('BR_D')
  @ApiOperation({ summary: 'Delete a Branch' })
  async delete(@Param('id') id: string): Promise<ApiResponse<void>> {
    await this.branchService.delete(id);
    return ApiResponse.successMessage('Branch deleted successfully');
  }
}
