export interface Review {
  id: string;
  reviewer_name: string;
  rating: number; // 1-5
  comment: string;
  created_at: string;
}

export interface CreateReviewPayload {
  reviewer_name: string;
  rating: number; // 1-5
  comment: string;
}
