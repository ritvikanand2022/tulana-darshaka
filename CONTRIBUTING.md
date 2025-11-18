# Contributing to Tulana Darshaka

First off, thank you for considering contributing to Tulana Darshaka! It's people like you that make this project such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and expected behavior**
- **Explain why this enhancement would be useful**

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Follow the coding standards** outlined below
3. **Write clear commit messages** (see commit message guidelines)
4. **Add tests** for any new functionality
5. **Update documentation** if needed
6. **Ensure the test suite passes** (`npm test`)
7. **Make sure your code lints** (`npm run lint`)

## Development Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker (optional but recommended)

### Setup Steps

1. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/tulana-darshaka.git
   cd tulana-darshaka
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your local settings
   ```

4. **Start databases**
   ```bash
   docker-compose up -d postgres redis
   ```

5. **Run migrations**
   ```bash
   npm run db:migrate
   ```

6. **Start development servers**
   ```bash
   npm run dev
   ```

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` types when possible
- Document complex types

### Vue Components
- Use Composition API with `<script setup>`
- One component per file
- Use TypeScript with proper props typing
- Follow single responsibility principle

### File Naming
- Components: `PascalCase.vue`
- Composables: `useCamelCase.ts`
- Utilities: `camelCase.ts`
- Constants: `UPPER_SNAKE_CASE.ts`

### Code Style
```typescript
// ✅ Good
const handleClick = async () => {
  try {
    const result = await fetchData()
    return result
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// ❌ Bad
const handleClick = async () => {
  const result = await fetchData()
  return result
}
```

### Component Structure
```vue
<script setup lang="ts">
// 1. Imports
import { ref, computed } from 'vue'

// 2. Props & Emits
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

const emit = defineEmits<{
  update: [value: number]
}>()

// 3. Composables
const { user } = useAuth()

// 4. Reactive State
const isOpen = ref(false)

// 5. Computed
const displayTitle = computed(() => props.title.toUpperCase())

// 6. Methods
const handleUpdate = () => {
  emit('update', props.count + 1)
}

// 7. Lifecycle hooks
onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <!-- Template here -->
</template>

<style scoped>
/* Styles here */
</style>
```

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(comparison): add export to PDF functionality

fix(auth): resolve token refresh issue on mobile

docs(readme): update installation instructions

refactor(product): simplify price calculation logic
```

## Testing

### Writing Tests

```typescript
// Component Test
import { mount } from '@vue/test-utils'
import ProductCard from './ProductCard.vue'

describe('ProductCard', () => {
  it('renders product name', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: {
          name: 'Test Product',
          price: 99.99
        }
      }
    })

    expect(wrapper.text()).toContain('Test Product')
  })
})
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Documentation

- Keep README.md up to date
- Document all public APIs
- Add JSDoc comments for functions
- Update CHANGELOG.md

### JSDoc Example
```typescript
/**
 * Calculates the discount percentage for a product
 * @param originalPrice - The original price of the product
 * @param discountedPrice - The discounted price
 * @returns The discount percentage (0-100)
 */
function calculateDiscount(
  originalPrice: number,
  discountedPrice: number
): number {
  return ((originalPrice - discountedPrice) / originalPrice) * 100
}
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Write code
   - Add tests
   - Update docs

3. **Commit your changes**
   ```bash
   git commit -m "feat(scope): add amazing feature"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**
   - Use a clear title
   - Reference any related issues
   - Describe your changes
   - Add screenshots if applicable

6. **Wait for review**
   - Address any feedback
   - Keep commits clean and logical

## Project Structure

```
tulana-darshaka/
├── apps/
│   ├── web/          # Frontend application
│   │   ├── components/
│   │   ├── pages/
│   │   ├── composables/
│   │   └── ...
│   └── api/          # Backend application
│       ├── src/
│       │   ├── modules/
│       │   ├── common/
│       │   └── ...
│       └── test/
├── packages/
│   ├── shared/       # Shared code
│   └── config/       # Shared configs
└── docs/            # Documentation
```

## Questions?

Feel free to:
- Open an issue for discussion
- Join our Discord server
- Email us at dev@tulanadarshaka.com

Thank you for contributing! 🎉
