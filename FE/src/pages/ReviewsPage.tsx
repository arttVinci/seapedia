import { useState } from "react";
import { useReviews } from "../hooks/queries/reviews/useReviews";
import { useCreateReview } from "../hooks/mutations/reviews/useCreateReview";
import { Button, Card, CardContent } from "../components/ui";
import { Star } from "lucide-react";

export function ReviewsPage() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  
  const { data: reviews, isLoading } = useReviews();
  const createReview = useCreateReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !reviewerName.trim()) return;

    createReview.mutate(
      { reviewer_name: reviewerName, rating, comment },
      {
        onSuccess: () => {
          setComment("");
          setReviewerName("");
          setRating(5);
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
          Ulasan Aplikasi
        </h1>
        <p className="mt-2 text-gray-600">Bagikan pengalaman Anda menggunakan Seapedia.</p>
      </div>

      <Card className="mb-10">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tulis Ulasan Anda</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input
                type="text"
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Nama Anda"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Komentar</label>
              <textarea
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Bagaimana pendapat Anda tentang aplikasi ini?"
                required
              />
            </div>
            <Button type="submit" isLoading={createReview.isPending}>
              Kirim Ulasan
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Semua Ulasan</h3>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 h-32 rounded-lg w-full"></div>
            ))}
          </div>
        ) : !reviews || reviews.length === 0 ? (
          <p className="text-gray-500">Belum ada ulasan untuk aplikasi ini.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6">
                <div className="flex items-center mb-2">
                  <div className="font-medium text-gray-900 mr-2">{review.reviewer_name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString("id-ID")}
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p>{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
