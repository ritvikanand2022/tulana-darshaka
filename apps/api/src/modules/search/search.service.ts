import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchQueryDto, SearchType } from './dto/search-query.dto';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(searchQuery: SearchQueryDto) {
    const { query, type, page = 1, pageSize = 10 } = searchQuery;
    const skip = (page - 1) * pageSize;

    const results: any = {
      query,
      type,
      page,
      pageSize,
      results: {},
      totalResults: 0,
    };

    // Search products
    if (type === SearchType.ALL || type === SearchType.PRODUCTS) {
      const productsResult = await this.searchProducts(query, searchQuery, skip, pageSize);
      results.results.products = productsResult.products;
      results.totalResults += productsResult.total;

      if (type === SearchType.PRODUCTS) {
        results.total = productsResult.total;
        results.totalPages = Math.ceil(productsResult.total / pageSize);
      }
    }

    // Search categories
    if (type === SearchType.ALL || type === SearchType.CATEGORIES) {
      const categoriesResult = await this.searchCategories(query, skip, pageSize);
      results.results.categories = categoriesResult.categories;
      results.totalResults += categoriesResult.total;

      if (type === SearchType.CATEGORIES) {
        results.total = categoriesResult.total;
        results.totalPages = Math.ceil(categoriesResult.total / pageSize);
      }
    }

    // Search reviews
    if (type === SearchType.ALL || type === SearchType.REVIEWS) {
      const reviewsResult = await this.searchReviews(query, skip, pageSize);
      results.results.reviews = reviewsResult.reviews;
      results.totalResults += reviewsResult.total;

      if (type === SearchType.REVIEWS) {
        results.total = reviewsResult.total;
        results.totalPages = Math.ceil(reviewsResult.total / pageSize);
      }
    }

    // For 'all' type, calculate total pages based on all results
    if (type === SearchType.ALL) {
      results.total = results.totalResults;
      results.totalPages = Math.ceil(results.totalResults / pageSize);
    }

    return results;
  }

  async searchProducts(query: string, filters: SearchQueryDto, skip: number, take: number) {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

    const where: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { sku: { contains: query, mode: 'insensitive' } },
      ],
    };

    // Add category filter
    if (filters.categories && filters.categories.length > 0) {
      where.category = {
        slug: { in: filters.categories },
      };
    }

    // Add price filters
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            take: 1,
            orderBy: { order: 'asc' },
          },
        },
        orderBy: [
          { name: 'asc' },
        ],
        skip,
        take,
      }),
      this.prisma.product.count({ where }),
    ]);

    // Calculate relevance score
    const productsWithScore = products.map(product => {
      let score = 0;
      const productText = `${product.name} ${product.brand} ${product.description}`.toLowerCase();

      // Exact match in name
      if (product.name.toLowerCase().includes(query.toLowerCase())) {
        score += 10;
      }

      // Exact match in brand
      if (product.brand?.toLowerCase().includes(query.toLowerCase())) {
        score += 5;
      }

      // Match in description
      if (product.description?.toLowerCase().includes(query.toLowerCase())) {
        score += 2;
      }

      // Count matching terms
      searchTerms.forEach(term => {
        if (productText.includes(term)) {
          score += 1;
        }
      });

      return {
        ...product,
        relevanceScore: score,
      };
    });

    // Sort by relevance
    productsWithScore.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return { products: productsWithScore, total };
  }

  async searchCategories(query: string, skip: number, take: number) {
    const where = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    };

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: { name: 'asc' },
        skip,
        take,
      }),
      this.prisma.category.count({ where }),
    ]);

    return { categories, total };
  }

  async searchReviews(query: string, skip: number, take: number) {
    const where = {
      AND: [
        {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        },
        { status: 'APPROVED' }, // Only search approved reviews
      ],
    };

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: {
                take: 1,
                orderBy: { order: 'asc' },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.review.count({ where }),
    ]);

    return { reviews, total };
  }

  async getSuggestions(query: string, limit: number = 5) {
    if (!query || query.length < 2) {
      return { suggestions: [] };
    }

    const searchTerms = query.toLowerCase();

    // Get product name suggestions
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        name: true,
        brand: true,
        slug: true,
      },
      take: limit,
    });

    // Get category suggestions
    const categories = await this.prisma.category.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      select: {
        name: true,
        slug: true,
      },
      take: limit,
    });

    const suggestions = [
      ...products.map(p => ({
        type: 'product',
        text: p.name,
        subtext: p.brand,
        url: `/products/${p.slug}`,
      })),
      ...categories.map(c => ({
        type: 'category',
        text: c.name,
        url: `/categories/${c.slug}`,
      })),
    ];

    return { suggestions: suggestions.slice(0, limit) };
  }

  async getPopularSearches(limit: number = 10) {
    // This would typically come from a search analytics table
    // For now, return most viewed/popular products
    const products = await this.prisma.product.findMany({
      select: {
        name: true,
        slug: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return {
      searches: products.map(p => ({
        query: p.name,
        url: `/products/${p.slug}`,
      })),
    };
  }
}
