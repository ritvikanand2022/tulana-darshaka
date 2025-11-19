import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISCONTINUED = 'DISCONTINUED',
}

export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  PRE_ORDER = 'PRE_ORDER',
  DISCONTINUED = 'DISCONTINUED',
}

export class CreateProductDto {
  @ApiProperty({ example: 'MacBook Pro 14"' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Apple' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 'M3 Pro', required: false })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({ example: 'Powerful laptop with M3 Pro chip', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1999 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'laptops' })
  @IsString()
  categoryId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  specifications?: Record<string, any>;

  @ApiProperty({ enum: ProductStatus, default: ProductStatus.ACTIVE, required: false })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @ApiProperty({ enum: StockStatus, default: StockStatus.IN_STOCK, required: false })
  @IsEnum(StockStatus)
  @IsOptional()
  stockStatus?: StockStatus;
}
