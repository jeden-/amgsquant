import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateAddressDto) {
    // Jeśli nowy adres jest domyślny, usuń flagę z innych
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return await this.prisma.address.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async findAll(userId: string) {
    return await this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string, userId: string) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  async update(id: string, userId: string, dto: Partial<CreateAddressDto>) {
    const address = await this.findOne(id, userId);

    // Jeśli ustawia jako domyślny, usuń flagę z innych
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return await this.prisma.address.update({
      where: { id: address.id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    const address = await this.findOne(id, userId);

    await this.prisma.address.delete({
      where: { id: address.id },
    });

    return { message: 'Address deleted successfully' };
  }
}
