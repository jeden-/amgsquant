# @amgsquant/shared

Współdzielony package zawierający typy TypeScript, constants, validators i utilities używane przez frontend i backend.

## Instalacja

```bash
cd packages/shared
pnpm install
```

## Zawartość

### Types
- **index.ts** - Re-export typów z database package + dodatkowe typy API

### Constants
- **formats.ts** - Standardowe formaty (A4, A3, A2, etc.)
- **materials.ts** - Informacje o materiałach
- **delivery.ts** - Opcje dostawy i rush

### Utils
- **price.utils.ts** - Utilities do obliczeń cenowych
- **format.utils.ts** - Utilities do formatowania

### Validators
- **order.validator.ts** - Zod schemas dla walidacji

## Użycie

### W Frontend (Next.js)
```typescript
import { ProductConfiguration, formatPrice, STANDARD_FORMATS } from '@amgsquant/shared';

const config: ProductConfiguration = {
  productType: 'POSTER',
  width: STANDARD_FORMATS.A1.width,
  height: STANDARD_FORMATS.A1.height,
  material: 'PAPER_135G',
  quantity: 10,
  finishing: {}
};

const price = 123.45;
console.log(formatPrice(price)); // "123.45 PLN"
```

### W Backend (NestJS)
```typescript
import { PriceCalculationRequest, productConfigurationSchema } from '@amgsquant/shared';

// Walidacja z Zod
const result = productConfigurationSchema.safeParse(data);
if (!result.success) {
  throw new BadRequestException(result.error);
}
```

## Development

```bash
# Type check
pnpm type-check

# Build
pnpm build

# Lint
pnpm lint
```

