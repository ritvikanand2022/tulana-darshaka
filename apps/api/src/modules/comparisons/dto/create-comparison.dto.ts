import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ArrayMinSize, ArrayMaxSize, IsBoolean } from 'class-validator';

export class CreateComparisonDto {
  @ApiProperty({ required: false, example: 'MacBook Pro vs Dell XPS vs ThinkPad' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: ['product-id-1', 'product-id-2', 'product-id-3'],
    description: 'Array of product IDs to compare (2-6 products)'
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(6)
  productIds: string[];

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
