import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('search')
@Controller('search')
@Public() // All search routes are public
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search across products, categories, and reviews' })
  @ApiResponse({ status: 200, description: 'Returns search results' })
  async search(@Query() searchQuery: SearchQueryDto) {
    return this.searchService.search(searchQuery);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get search suggestions for autocomplete' })
  @ApiResponse({ status: 200, description: 'Returns search suggestions' })
  async getSuggestions(
    @Query('q') query: string,
    @Query('limit') limit?: number,
  ) {
    return this.searchService.getSuggestions(query, limit);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular searches' })
  @ApiResponse({ status: 200, description: 'Returns popular searches' })
  async getPopularSearches(@Query('limit') limit?: number) {
    return this.searchService.getPopularSearches(limit);
  }
}
