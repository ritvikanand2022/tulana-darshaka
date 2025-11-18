export interface Comparison {
  id: string;
  title?: string;
  slug: string;
  productIds: string[];
  userId?: string;
  isPublic: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComparisonWithProducts extends Comparison {
  products: Array<{
    id: string;
    name: string;
    brand: string;
    price: number;
    images: Array<{ url: string; alt?: string }>;
    specifications?: Record<string, any>;
  }>;
}

export interface CreateComparisonDto {
  title?: string;
  productIds: string[];
  isPublic?: boolean;
}

export interface ComparisonDifference {
  specKey: string;
  specLabel: string;
  values: Array<{
    productId: string;
    value: any;
    isDifferent: boolean;
  }>;
}
