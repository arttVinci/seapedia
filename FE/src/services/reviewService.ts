import type { Review, CreateReviewPayload } from "../@types/models";

const MOCK_REVIEWS: Review[] = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  product_id: String((i % 6) + 1),
  user_id: (i % 5) + 1,
  rating: (i % 3) + 3, // 3, 4, 5
  comment: `Ulasan bagus ${i + 1}! Produknya segar dan pengiriman cepat.`,
  user_name: `User ${(i % 5) + 1}`,
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
}));

let nextReviewId = 16;

export const reviewService = {
  getReviews: async (
    productId: string,
    page = 1,
    limit = 5
  ): Promise<{ data: Review[]; total: number }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const filtered = MOCK_REVIEWS.filter(
      (r) => r.product_id === productId
    );
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: filtered.slice(start, end),
      total: filtered.length,
    };
  },

  createReview: async (payload: CreateReviewPayload): Promise<Review> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newReview: Review = {
      id: nextReviewId++,
      product_id: String(payload.product_id),
      user_id: 1, // mock user
      rating: payload.rating,
      comment: payload.comment,
      user_name: "Current User",
      created_at: new Date().toISOString(),
    };
    MOCK_REVIEWS.push(newReview);
    return newReview;
  },
};
