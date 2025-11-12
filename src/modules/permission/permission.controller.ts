import { Body, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiController } from 'src/decorators/api-controller.decorator';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { PermissionDto } from './dtos/permission.dto';
import { PermissionService } from './permission.service';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';

@ApiController('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create new permission' })
  async create(@Body() dto: CreatePermissionDto): Promise<ApiResponse<PermissionDto>> {
    const created = await this.permissionService.create(dto);
    return ApiResponse.success(created, 'Permission created successfully');
  }

  @Get('list')
  @ApiOperation({ summary: 'Get all permissions' })
  async findAll(): Promise<ApiResponse<PermissionDto[]>> {
    const permissions = await this.permissionService.findAll();
    return ApiResponse.success(permissions, 'Get list permissions successfully');
  }
}
