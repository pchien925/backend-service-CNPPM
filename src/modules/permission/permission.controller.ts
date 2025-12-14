import { Body, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { PermissionDto } from './dtos/permission.dto';
import { PermissionService } from './permission.service';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';

@ApiController('permission', { auth: true })
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('create')
  @Permissions('PER_C')
  @ApiOperation({ summary: 'Create new permission' })
  async create(@Body() dto: CreatePermissionDto): Promise<ApiResponse<void>> {
    await this.permissionService.create(dto);
    return ApiResponse.successMessage('Permission created successfully');
  }

  @Get('list')
  @Permissions('PER_L')
  @ApiOperation({ summary: 'Get all permissions' })
  async findAll(): Promise<ApiResponse<ResponseListDto<PermissionDto[]>>> {
    const permissions = await this.permissionService.findAll();
    return ApiResponse.success(permissions, 'Get list permissions successfully');
  }
}
