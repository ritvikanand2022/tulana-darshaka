import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { categoryId, ...data } = createProductDto;

    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    // Generate slug from name
    const slug = this.generateSlug(data.name);

    // Check if slug already exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      throw new BadRequestException('Product with this name already exists');
    }

    return this.prisma.product.create({
      data: {
        ...data,
        slug,
        categoryId,
      },
      include: {
        images: true,
        category: true,
      },
    });
  }

  async findAll(query: QueryProductsDto) {
    const { page = 1, pageSize = 12, search, categoryId, brand, minPrice, maxPrice, status, stockStatus, sortBy, sortOrder } = query;

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (brand) {
      where.brand = { contains: brand, mode: 'insensitive' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    if (status) {
      where.status = status;
    }

    if (stockStatus) {
      where.stockStatus = stockStatus;
    }

    // Build orderBy
    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder;
    }

    // Execute query
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: {
          images: {
            orderBy: { order: 'asc' },
            take: 1,
          },
          category: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        category: true,
        affiliateLinks: {
          where: { active: true },
        },
        priceHistory: {
          orderBy: { createdAt: 'desc' },
          take: 30,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        category: true,
        affiliateLinks: {
          where: { active: true },
        },
        priceHistory: {
          orderBy: { createdAt: 'desc' },
          take: 30,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // If name is being updated, regenerate slug
    let slug: string | undefined;
    if (updateProductDto.name && updateProductDto.name !== product.name) {
      slug = this.generateSlug(updateProductDto.name);

      // Check if new slug already exists
      const existingProduct = await this.prisma.product.findUnique({
        where: { slug },
      });

      if (existingProduct && existingProduct.id !== id) {
        throw new BadRequestException('Product with this name already exists');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        ...(slug && { slug }),
      },
      include: {
        images: true,
        category: true,
      },
    });
  }

  async remove(id: string) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async getStats(categoryId?: string) {
    const where: any = categoryId ? { categoryId } : {};

    const [total, active, outOfStock] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.count({ where: { ...where, status: 'ACTIVE' } }),
      this.prisma.product.count({ where: { ...where, stockStatus: 'OUT_OF_STOCK' } }),
    ]);

    const avgPrice = await this.prisma.product.aggregate({
      where,
      _avg: { price: true },
    });

    return {
      total,
      active,
      outOfStock,
      averagePrice: avgPrice._avg.price || 0,
    };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
