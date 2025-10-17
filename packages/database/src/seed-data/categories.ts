import { Prisma } from '@prisma/client';

export const categories: Prisma.CategoryCreateInput[] = [
  {
    name: 'Banery',
    slug: 'banery',
    description: 'Banery reklamowe do użytku zewnętrznego',
    active: true,
  },
  {
    name: 'Plakaty',
    slug: 'plakaty',
    description: 'Plakaty wielkoformatowe',
    active: true,
  },
  {
    name: 'Naklejki',
    slug: 'naklejki',
    description: 'Naklejki i folie samoprzylepne',
    active: true,
  },
  {
    name: 'Druki wielkoformatowe',
    slug: 'druki-wielkoformatowe',
    description: 'Druki na różnych materiałach',
    active: true,
  },
  {
    name: 'Folie backlit',
    slug: 'folie-backlit',
    description: 'Folie do oświetlanych konstrukcji',
    active: true,
  },
];
