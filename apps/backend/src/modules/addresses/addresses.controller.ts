import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';

@ApiTags('addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressesController {
  constructor(private addressesService: AddressesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new address' })
  async create(@Request() req, @Body() dto: CreateAddressDto) {
    return await this.addressesService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user addresses' })
  async findAll(@Request() req) {
    return await this.addressesService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get address by id' })
  async findOne(@Param('id') id: string, @Request() req) {
    return await this.addressesService.findOne(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update address' })
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: Partial<CreateAddressDto>,
  ) {
    return await this.addressesService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address' })
  async remove(@Param('id') id: string, @Request() req) {
    return await this.addressesService.remove(id, req.user.id);
  }
}
