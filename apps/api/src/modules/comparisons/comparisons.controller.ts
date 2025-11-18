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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ComparisonsService } from './comparisons.service';
import { CreateComparisonDto } from './dto/create-comparison.dto';
import { UpdateComparisonDto } from './dto/update-comparison.dto';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('comparisons')
@Controller('comparisons')
export class ComparisonsController {
  constructor(private readonly comparisonsService: ComparisonsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new comparison (requires authentication)' })
  @ApiResponse({ status: 201, description: 'Comparison created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createComparisonDto: CreateComparisonDto, @CurrentUser() user: any) {
    return this.comparisonsService.create(createComparisonDto, user?.id);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all public comparisons' })
  @ApiResponse({ status: 200, description: 'Comparisons retrieved successfully' })
  findAll() {
    return this.comparisonsService.findAll();
  }

  @Public()
  @Get('preview')
  @ApiOperation({ summary: 'Preview comparison without saving' })
  @ApiQuery({ name: 'productIds', description: 'Comma-separated product IDs', required: true })
  @ApiResponse({ status: 200, description: 'Comparison preview generated' })
  async previewComparison(@Query('productIds') productIds: string) {
    const ids = productIds.split(',').filter(Boolean);
    return this.comparisonsService.getComparisonWithProducts(ids);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a comparison by slug' })
  @ApiResponse({ status: 200, description: 'Comparison found' })
  @ApiResponse({ status: 404, description: 'Comparison not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.comparisonsService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a comparison by ID' })
  @ApiResponse({ status: 200, description: 'Comparison found' })
  @ApiResponse({ status: 404, description: 'Comparison not found' })
  findOne(@Param('id') id: string) {
    return this.comparisonsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a comparison (requires authentication)' })
  @ApiResponse({ status: 200, description: 'Comparison updated successfully' })
  @ApiResponse({ status: 404, description: 'Comparison not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(@Param('id') id: string, @Body() updateComparisonDto: UpdateComparisonDto, @CurrentUser() user: any) {
    return this.comparisonsService.update(id, updateComparisonDto, user?.id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a comparison (requires authentication)' })
  @ApiResponse({ status: 204, description: 'Comparison deleted successfully' })
  @ApiResponse({ status: 404, description: 'Comparison not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.comparisonsService.remove(id, user?.id);
  }
}
