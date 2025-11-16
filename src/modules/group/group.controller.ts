import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { GroupService } from './group.service';
import { Body, Get, Post, Query } from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { CreateGroupDto } from './dtos/create-group.dto';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { GroupDto } from './dtos/group.dto';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';
import { GroupQueryDto } from './dtos/groups-query.dto';

@ApiController('group', { auth: true })
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('create')
  @Permissions('GR_C')
  @ApiOperation({ summary: 'Create new group' })
  async create(@Body() dto: CreateGroupDto): Promise<ApiResponse<void>> {
    await this.groupService.create(dto);
    return ApiResponse.successMessage('Group created successfully');
  }

  @Get('list')
  @Permissions('GR_L')
  @ApiOperation({ summary: 'Get all groups' })
  async findAll(@Query() query: GroupQueryDto): Promise<ApiResponse<ResponseListDto<GroupDto[]>>> {
    const permissions = await this.groupService.findAll(query);
    return ApiResponse.success(permissions, 'Get list permissions successfully');
  }
}
