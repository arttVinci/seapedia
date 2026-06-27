export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  user_name?: string;
  created_at?: string;
}

export interface CreateReviewPayload {
  product_id: number;
  rating: number;
  comment: string;
}
