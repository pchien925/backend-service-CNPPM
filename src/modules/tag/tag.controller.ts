import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { CreateTagDto } from './dtos/create-tag.dto';
import { TagQueryDto } from './dtos/tag-query.dto';
import { TagDto } from './dtos/tag.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';
import { TagService } from './tag.service';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';

@ApiTags('Tag')
@ApiController('tag', { auth: true })
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('create')
  @Permissions('TAG_C')
  @ApiOperation({ summary: 'Create new Tag' })
  async create(@Body() dto: CreateTagDto): Promise<ApiResponse<void>> {
    await this.tagService.create(dto);
    return ApiResponse.successMessage('Tag created successfully');
  }

  @Get('list')
  @Permissions('TAG_L')
  @ApiOperation({ summary: 'Get list of all Tags' })
  async findAll(@Query() query: TagQueryDto): Promise<ApiResponse<ResponseListDto<TagDto[]>>> {
    const result = await this.tagService.findAll(query);
    return ApiResponse.success(result, 'Get list Tags successfully');
  }
  @Get('auto-complete')
  @ApiOperation({ summary: 'Get auto complete of Tags' })
  async autoComplete(@Query() query: TagQueryDto): Promise<ApiResponse<ResponseListDto<TagDto[]>>> {
    const result = await this.tagService.autoComplete(query);
    return ApiResponse.success(result, 'Get list Tags successfully');
  }
  @Get('get/:id')
  @Permissions('TAG_V')
  @ApiOperation({ summary: 'Get Tag detail' })
  async findOne(@Param('id') id: string): Promise<ApiResponse<TagDto>> {
    const tag = await this.tagService.findOne(id);
    return ApiResponse.success(tag, 'Get Tag detail successfully');
  }

  @Put('update')
  @Permissions('TAG_U')
  @ApiOperation({ summary: 'Update an existing Tag' })
  async update(@Body() dto: UpdateTagDto): Promise<ApiResponse<void>> {
    await this.tagService.update(dto);
    return ApiResponse.successMessage('Tag updated successfully');
  }

  @Delete('/delete/:id')
  @Permissions('TAG_D')
  @ApiOperation({ summary: 'Delete a Tag (hard delete)' })
  async delete(@Param('id') id: string): Promise<ApiResponse<void>> {
    await this.tagService.delete(id);
    return ApiResponse.successMessage('Tag deleted successfully');
  }
}
