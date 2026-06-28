export interface Review {
  id: number;
  product_id: string;
  user_id: number;
  rating: number;
  comment: string;
  user_name?: string;
  created_at?: string;
}

export interface CreateReviewPayload {
  product_id: string;
  rating: number;
  comment: string;
}
