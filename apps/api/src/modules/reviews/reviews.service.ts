import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewsDto } from './dto/query-reviews.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto, userId: string) {
    const { productId, ...data } = createReviewDto;

    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = await this.prisma.review.findFirst({
      where: {
        productId,
        userId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this product');
    }

    return this.prisma.review.create({
      data: {
        ...data,
        productId,
        userId,
        status: 'PENDING', // Reviews start as pending for moderation
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            reputation: true,
          },
        },
      },
    });
  }

  async findAll(query: QueryReviewsDto) {
    const { page = 1, pageSize = 10, productId, userId, rating, status, verified, sortBy } = query;

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {};

    if (productId) {
      where.productId = productId;
    }

    if (userId) {
      where.userId = userId;
    }

    if (rating) {
      where.rating = rating;
    }

    if (status) {
      where.status = status;
    } else {
      // By default, only show approved reviews
      where.status = 'APPROVED';
    }

    if (verified !== undefined) {
      where.verified = verified;
    }

    // Build orderBy
    let orderBy: any = {};

    switch (sortBy) {
      case 'helpful':
        orderBy = { helpfulCount: 'desc' };
        break;
      case 'rating_high':
        orderBy = { rating: 'desc' };
        break;
      case 'rating_low':
        orderBy = { rating: 'asc' };
        break;
      case 'recent':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Execute query
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
              reputation: true,
            },
          },
          _count: {
            select: {
              votes: true,
            },
          },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      reviews,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            reputation: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Only owner can update their review
    if (review.userId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    return this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            reputation: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Only owner can delete their review
    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    return this.prisma.review.delete({
      where: { id },
    });
  }

  async voteReview(reviewId: string, userId: string, helpful: boolean) {
    // Check if review exists
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Check if user already voted
    const existingVote = await this.prisma.reviewVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });

    if (existingVote) {
      // Update existing vote
      if (existingVote.helpful !== helpful) {
        await this.prisma.reviewVote.update({
          where: { id: existingVote.id },
          data: { helpful },
        });

        // Update helpful count
        await this.updateHelpfulCount(reviewId);
      }
    } else {
      // Create new vote
      await this.prisma.reviewVote.create({
        data: {
          reviewId,
          userId,
          helpful,
        },
      });

      // Update helpful count
      await this.updateHelpfulCount(reviewId);
    }

    return { success: true };
  }

  async removeVote(reviewId: string, userId: string) {
    const vote = await this.prisma.reviewVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });

    if (vote) {
      await this.prisma.reviewVote.delete({
        where: { id: vote.id },
      });

      await this.updateHelpfulCount(reviewId);
    }

    return { success: true };
  }

  async getProductStats(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        productId,
        status: 'APPROVED',
      },
      select: {
        rating: true,
      },
    });

    const totalReviews = reviews.length;

    if (totalReviews === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
      };
    }

    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    let totalRating = 0;

    reviews.forEach((review: any) => {
      const rating = review.rating as 1 | 2 | 3 | 4 | 5;
      ratingDistribution[rating]++;
      totalRating += review.rating;
    });

    return {
      averageRating: totalRating / totalReviews,
      totalReviews,
      ratingDistribution,
    };
  }

  private async updateHelpfulCount(reviewId: string) {
    const helpfulVotes = await this.prisma.reviewVote.count({
      where: {
        reviewId,
        helpful: true,
      },
    });

    await this.prisma.review.update({
      where: { id: reviewId },
      data: { helpfulCount: helpfulVotes },
    });
  }
}
