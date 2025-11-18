import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewsDto } from './dto/query-reviews.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createReviewDto: CreateReviewDto) {
    // TODO: Get userId from auth context
    // For now, using a mock user ID
    const mockUserId = 'mock-user-id';
    return this.reviewsService.create(createReviewDto, mockUserId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews with filters' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  findAll(@Query() query: QueryReviewsDto) {
    return this.reviewsService.findAll(query);
  }

  @Get('product/:productId/stats')
  @ApiOperation({ summary: 'Get review statistics for a product' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  getProductStats(@Param('productId') productId: string) {
    return this.reviewsService.getProductStats(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiResponse({ status: 200, description: 'Review found' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a review' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    // TODO: Get userId from auth context
    const mockUserId = 'mock-user-id';
    return this.reviewsService.update(id, updateReviewDto, mockUserId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a review' })
  @ApiResponse({ status: 204, description: 'Review deleted successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  remove(@Param('id') id: string) {
    // TODO: Get userId from auth context
    const mockUserId = 'mock-user-id';
    return this.reviewsService.remove(id, mockUserId);
  }

  @Post(':id/vote')
  @ApiOperation({ summary: 'Vote on a review (helpful/not helpful)' })
  @ApiResponse({ status: 200, description: 'Vote registered successfully' })
  @ApiQuery({ name: 'helpful', type: Boolean })
  voteReview(@Param('id') id: string, @Query('helpful') helpful: string) {
    // TODO: Get userId from auth context
    const mockUserId = 'mock-user-id';
    const isHelpful = helpful === 'true';
    return this.reviewsService.voteReview(id, mockUserId, isHelpful);
  }

  @Delete(':id/vote')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove vote from a review' })
  @ApiResponse({ status: 204, description: 'Vote removed successfully' })
  removeVote(@Param('id') id: string) {
    // TODO: Get userId from auth context
    const mockUserId = 'mock-user-id';
    return this.reviewsService.removeVote(id, mockUserId);
  }
}
