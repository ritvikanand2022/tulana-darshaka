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
import { ComparisonsService } from './comparisons.service';
import { CreateComparisonDto } from './dto/create-comparison.dto';
import { UpdateComparisonDto } from './dto/update-comparison.dto';

@ApiTags('comparisons')
@Controller('comparisons')
export class ComparisonsController {
  constructor(private readonly comparisonsService: ComparisonsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comparison' })
  @ApiResponse({ status: 201, description: 'Comparison created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createComparisonDto: CreateComparisonDto) {
    return this.comparisonsService.create(createComparisonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all public comparisons' })
  @ApiResponse({ status: 200, description: 'Comparisons retrieved successfully' })
  findAll() {
    return this.comparisonsService.findAll();
  }

  @Get('preview')
  @ApiOperation({ summary: 'Preview comparison without saving' })
  @ApiQuery({ name: 'productIds', description: 'Comma-separated product IDs', required: true })
  @ApiResponse({ status: 200, description: 'Comparison preview generated' })
  async previewComparison(@Query('productIds') productIds: string) {
    const ids = productIds.split(',').filter(Boolean);
    return this.comparisonsService.getComparisonWithProducts(ids);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a comparison by slug' })
  @ApiResponse({ status: 200, description: 'Comparison found' })
  @ApiResponse({ status: 404, description: 'Comparison not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.comparisonsService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a comparison by ID' })
  @ApiResponse({ status: 200, description: 'Comparison found' })
  @ApiResponse({ status: 404, description: 'Comparison not found' })
  findOne(@Param('id') id: string) {
    return this.comparisonsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a comparison' })
  @ApiResponse({ status: 200, description: 'Comparison updated successfully' })
  @ApiResponse({ status: 404, description: 'Comparison not found' })
  update(@Param('id') id: string, @Body() updateComparisonDto: UpdateComparisonDto) {
    return this.comparisonsService.update(id, updateComparisonDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a comparison' })
  @ApiResponse({ status: 204, description: 'Comparison deleted successfully' })
  @ApiResponse({ status: 404, description: 'Comparison not found' })
  remove(@Param('id') id: string) {
    return this.comparisonsService.remove(id);
  }
}
