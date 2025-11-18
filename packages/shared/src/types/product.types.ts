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

export interface Product {
  id: string;
  name: string;
  brand: string;
  model?: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  specifications?: Record<string, any>;
  categoryId: string;
  status: ProductStatus;
  stockStatus: StockStatus;
  releaseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductWithImages extends Product {
  images: ProductImage[];
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  icon?: string;
  order: number;
}

export interface CreateProductDto {
  name: string;
  brand: string;
  model?: string;
  description?: string;
  price: number;
  categoryId: string;
  specifications?: Record<string, any>;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface ProductFilters {
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  status?: ProductStatus;
  stockStatus?: StockStatus;
}

export interface ProductListResponse {
  products: ProductWithImages[];
  total: number;
  page: number;
  pageSize: number;
}
