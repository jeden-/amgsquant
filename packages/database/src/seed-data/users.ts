import { UserType, UserStatus, Prisma } from '@prisma/client';

export const users: Prisma.UserCreateInput[] = [
  {
    email: 'admin@amgsquant.pl',
    password: '$2b$10$hashedpassword', // admin123
    firstName: 'Admin',
    lastName: 'System',
    phone: '+48 123 456 789',
    type: UserType.ADMIN,
    status: UserStatus.ACTIVE,
    emailVerified: true,
    emailVerifiedAt: new Date(),
  },
  {
    email: 'operator@amgsquant.pl',
    password: '$2b$10$hashedpassword', // operator123
    firstName: 'Jan',
    lastName: 'Kowalski',
    phone: '+48 987 654 321',
    type: UserType.OPERATOR,
    status: UserStatus.ACTIVE,
    emailVerified: true,
    emailVerifiedAt: new Date(),
  },
  {
    email: 'klient@example.com',
    password: '$2b$10$hashedpassword', // klient123
    firstName: 'Anna',
    lastName: 'Nowak',
    phone: '+48 555 123 456',
    type: UserType.CUSTOMER,
    status: UserStatus.ACTIVE,
    emailVerified: true,
    emailVerifiedAt: new Date(),
  },
  {
    email: 'firma@example.com',
    password: '$2b$10$hashedpassword', // firma123
    firstName: 'Piotr',
    lastName: 'Wiśniewski',
    phone: '+48 666 789 012',
    type: UserType.BUSINESS,
    status: UserStatus.ACTIVE,
    emailVerified: true,
    emailVerifiedAt: new Date(),
    companyName: 'Firma Reklamowa Sp. z o.o.',
    nip: '1234567890',
    regon: '123456789',
  },
];
