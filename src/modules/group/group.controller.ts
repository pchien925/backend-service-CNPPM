import { Body, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';
import { CreateGroupDto } from './dtos/create-group.dto';
import { GroupDto } from './dtos/group.dto';
import { GroupQueryDto } from './dtos/groups-query.dto';
import { GroupService } from './group.service';

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

  @Get('get/:id')
  @Permissions('GR_V')
  @ApiOperation({ summary: 'Get group detail by ID' })
  async findOne(@Param('id') id: string): Promise<ApiResponse<GroupDto>> {
    const group = await this.groupService.findOne(id);
    return ApiResponse.success(group, 'Get group detail successfully');
  }
}
