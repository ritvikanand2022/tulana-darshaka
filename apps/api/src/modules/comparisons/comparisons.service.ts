import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateComparisonDto } from './dto/create-comparison.dto';
import { UpdateComparisonDto } from './dto/update-comparison.dto';

@Injectable()
export class ComparisonsService {
  constructor(private prisma: PrismaService) {}

  async create(createComparisonDto: CreateComparisonDto, userId?: string) {
    const { productIds, title, isPublic = true } = createComparisonDto;

    // Verify all products exist
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found');
    }

    // Generate slug
    const slug = this.generateSlug();

    // Create comparison
    return this.prisma.comparison.create({
      data: {
        title,
        slug,
        productIds,
        userId,
        isPublic,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
  }

  async findAll(userId?: string) {
    const where = userId ? { userId } : { isPublic: true };

    return this.prisma.comparison.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const comparison = await this.prisma.comparison.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    if (!comparison) {
      throw new NotFoundException('Comparison not found');
    }

    if (!comparison.isPublic) {
      throw new NotFoundException('Comparison is private');
    }

    return comparison;
  }

  async findBySlug(slug: string) {
    const comparison = await this.prisma.comparison.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    if (!comparison) {
      throw new NotFoundException('Comparison not found');
    }

    if (!comparison.isPublic) {
      throw new NotFoundException('Comparison is private');
    }

    // Increment view count
    await this.prisma.comparison.update({
      where: { id: comparison.id },
      data: { views: { increment: 1 } },
    });

    // Get full product details
    const products = await this.prisma.product.findMany({
      where: { id: { in: comparison.productIds } },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        category: true,
      },
    });

    // Return comparison with products in the same order as productIds
    const orderedProducts = comparison.productIds.map((id) =>
      products.find((p) => p.id === id),
    );

    return {
      ...comparison,
      products: orderedProducts.filter(Boolean),
    };
  }

  async update(id: string, updateComparisonDto: UpdateComparisonDto, userId?: string) {
    const comparison = await this.prisma.comparison.findUnique({
      where: { id },
    });

    if (!comparison) {
      throw new NotFoundException('Comparison not found');
    }

    // Only owner can update
    if (userId && comparison.userId !== userId) {
      throw new BadRequestException('You can only update your own comparisons');
    }

    return this.prisma.comparison.update({
      where: { id },
      data: updateComparisonDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId?: string) {
    const comparison = await this.prisma.comparison.findUnique({
      where: { id },
    });

    if (!comparison) {
      throw new NotFoundException('Comparison not found');
    }

    // Only owner can delete
    if (userId && comparison.userId !== userId) {
      throw new BadRequestException('You can only delete your own comparisons');
    }

    return this.prisma.comparison.delete({
      where: { id },
    });
  }

  async getComparisonWithProducts(productIds: string[]) {
    // Verify all products exist
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        category: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found');
    }

    // Return products in the same order as productIds
    const orderedProducts = productIds.map((id) => products.find((p) => p.id === id));

    return {
      products: orderedProducts.filter(Boolean),
      differences: this.calculateDifferences(orderedProducts.filter(Boolean)),
    };
  }

  private calculateDifferences(products: any[]) {
    if (products.length < 2) return [];

    const allSpecs = new Set<string>();
    products.forEach((product) => {
      if (product.specifications) {
        Object.keys(product.specifications).forEach((key) => allSpecs.add(key));
      }
    });

    const differences = [];

    for (const specKey of allSpecs) {
      const values = products.map((product) => ({
        productId: product.id,
        value: product.specifications?.[specKey] || null,
      }));

      // Check if values are different
      const uniqueValues = new Set(values.map((v) => JSON.stringify(v.value)));
      const isDifferent = uniqueValues.size > 1;

      differences.push({
        specKey,
        specLabel: this.formatSpecKey(specKey),
        values: values.map((v) => ({
          ...v,
          isDifferent,
        })),
      });
    }

    return differences;
  }

  private formatSpecKey(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  private generateSlug(): string {
    return `cmp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
