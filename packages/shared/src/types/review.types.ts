export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FLAGGED = 'FLAGGED',
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  images: string[];
  videos: string[];
  verified: boolean;
  helpfulCount: number;
  productId: string;
  userId: string;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewWithUser extends Review {
  user: {
    id: string;
    name?: string;
    username?: string;
    avatar?: string;
    reputation: number;
  };
}

export interface CreateReviewDto {
  rating: number;
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  productId: string;
}

export interface ReviewFilters {
  productId?: string;
  userId?: string;
  rating?: number;
  status?: ReviewStatus;
  verified?: boolean;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
