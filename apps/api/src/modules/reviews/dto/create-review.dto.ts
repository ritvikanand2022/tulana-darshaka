import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsOptional, Min, Max, ArrayMaxSize } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Best laptop I\'ve ever owned' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'The M3 Pro chip is incredibly fast...' })
  @IsString()
  content: string;

  @ApiProperty({ required: false, example: ['Excellent performance', 'Long battery life'] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  @IsOptional()
  pros?: string[];

  @ApiProperty({ required: false, example: ['Expensive', 'Limited ports'] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  @IsOptional()
  cons?: string[];

  @ApiProperty({ example: 'product-id' })
  @IsString()
  productId: string;
}
