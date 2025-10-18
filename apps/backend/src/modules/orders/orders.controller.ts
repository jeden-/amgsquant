import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  async createOrder(@Request() req, @Body() dto: CreateOrderDto) {
    return await this.ordersService.createOrder(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user orders' })
  async listOrders(@Request() req) {
    return await this.ordersService.listOrders(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  async getOrder(@Param('id') id: string, @Request() req) {
    return await this.ordersService.getOrder(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update order status' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateOrderDto,
  ) {
    return await this.ordersService.updateOrderStatus(id, req.user.id, dto);
  }
}
