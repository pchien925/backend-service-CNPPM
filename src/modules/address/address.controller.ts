import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { ResponseListDto } from 'src/shared/dtos/response-list.dto';
import { AddressService } from './address.service';
import { AddressDto } from './dtos/address.dto';
import { AddressQueryDto } from './dtos/address-query.dto';
import { CreateAddressDto } from './dtos/create-address.dto';
import { UpdateAddressDto } from './dtos/update-address.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@ApiTags('Address')
@ApiController('address', { auth: true })
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('create')
  @Permissions('ADD_C')
  @ApiOperation({ summary: 'Create a new address' })
  async create(@Body() dto: CreateAddressDto): Promise<ApiResponse<void>> {
    await this.addressService.create(dto);
    return ApiResponse.successMessage('Address created successfully');
  }

  @Get('list')
  @Permissions('ADD_L')
  @ApiOperation({ summary: 'Get list of addresses with pagination' })
  async findAll(
    @Query() query: AddressQueryDto,
  ): Promise<ApiResponse<ResponseListDto<AddressDto[]>>> {
    const result = await this.addressService.findAll(query);
    return ApiResponse.success(result, 'Get list addresses successfully');
  }

  @Get('auto-complete')
  @ApiOperation({ summary: 'Auto-complete address search' })
  async autoComplete(
    @Query() query: AddressQueryDto,
  ): Promise<ApiResponse<ResponseListDto<AddressDto[]>>> {
    const result = await this.addressService.autoComplete(query);
    return ApiResponse.success(result, 'Get auto-complete successfully');
  }

  @Get('get/:id')
  @Permissions('ADD_V')
  @ApiOperation({ summary: 'Get address detail by ID' })
  async findOne(@Param('id') id: string): Promise<ApiResponse<AddressDto>> {
    const address = await this.addressService.findOne(id);
    return ApiResponse.success(address, 'Get address detail successfully');
  }

  @Put('update')
  @Permissions('ADD_U')
  @ApiOperation({ summary: 'Update address information' })
  async update(@Body() dto: UpdateAddressDto): Promise<ApiResponse<void>> {
    await this.addressService.update(dto);
    return ApiResponse.successMessage('Address updated successfully');
  }

  @Delete('delete/:id')
  @Permissions('ADD_D')
  @ApiOperation({ summary: 'Soft delete an address' })
  async delete(@Param('id') id: string): Promise<ApiResponse<void>> {
    await this.addressService.delete(id);
    return ApiResponse.successMessage('Address deleted successfully');
  }
}
