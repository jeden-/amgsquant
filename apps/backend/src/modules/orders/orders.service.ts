import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PricingEngineService } from '../pricing/pricing-engine.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';
import { OrderStatus, ShippingMethod, PaymentMethod, RushType } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private pricingEngine: PricingEngineService,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    // Sprawdź czy adresy należą do użytkownika
    const shippingAddress = await this.prisma.address.findFirst({
      where: { id: dto.shippingAddressId, userId },
    });

    const billingAddress = await this.prisma.address.findFirst({
      where: { id: dto.billingAddressId, userId },
    });

    if (!shippingAddress || !billingAddress) {
      throw new NotFoundException('Address not found');
    }

    // Oblicz całkowitą cenę
    let totalAmount = 0;
    const orderItems = [];

    for (const item of dto.items) {
      // Oblicz cenę dla każdego itemu
      const priceCalculation = this.pricingEngine.calculatePrice({
        productType: item.productType,
        width: item.width,
        height: item.height,
        materialType: item.materialType,
        quantity: item.quantity,
        finishingOptions: item.finishingOptions,
        rushType: dto.rushType,
        accountType: 'B2C', // Domyślnie B2C, można rozszerzyć
      });

      totalAmount += priceCalculation.grossPrice;

      orderItems.push({
        productType: item.productType,
        name: item.name,
        quantity: item.quantity,
        width: item.width,
        height: item.height,
        materialType: item.materialType,
        finishingOptions: item.finishingOptions,
        unitPrice: priceCalculation.unitPrice,
        totalPrice: priceCalculation.grossPrice,
      });
    }

    // Utwórz zamówienie
    const order = await this.prisma.order.create({
      data: {
        orderNumber: `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
        userId,
        subtotal: totalAmount,
        discount: 0,
        shippingCost: 0, // TODO: oblicz koszt wysyłki
        rushFee: 0, // TODO: oblicz opłatę za rush
        total: totalAmount,
        shippingAddressId: dto.shippingAddressId,
        billingAddressId: dto.billingAddressId,
        shippingMethod: dto.shippingMethod as ShippingMethod,
        paymentMethod: dto.paymentMethod as PaymentMethod,
        rushType: dto.rushType as RushType,
        status: OrderStatus.PENDING_PAYMENT,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
        shippingAddress: true,
        billingAddress: true,
        statusHistory: true,
      },
    });

    // Dodaj wpis do historii statusu
    await this.prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: OrderStatus.PENDING_PAYMENT,
        note: 'Order created',
      },
    });

    return order;
  }

  async getOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        shippingAddress: true,
        billingAddress: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  async listOrders(userId: string) {
    return await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        shippingAddress: true,
        billingAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(orderId: string, userId: string, dto: UpdateOrderDto) {
    const order = await this.getOrder(orderId, userId);

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: dto.status as OrderStatus,
      },
      include: {
        items: true,
        shippingAddress: true,
        billingAddress: true,
        statusHistory: true,
      },
    });

    // Dodaj wpis do historii statusu
    await this.prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: dto.status as OrderStatus,
        note: dto.notes || `Status changed to ${dto.status}`,
      },
    });

    return updatedOrder;
  }
}