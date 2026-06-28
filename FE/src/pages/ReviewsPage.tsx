import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useReviews } from "../hooks/useReviews";
import { useProductDetail } from "../hooks/queries/products/useProductDetail";
import { useCreateReview } from "../hooks/useCreateReview";
import { Button, Card, CardContent } from "../components/ui";
import { Star } from "lucide-react";

export function ReviewsPage() {
  const { id } = useParams();
  const productId = String(id);
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  
  const perPage = 5;

  const { data: product } = useProductDetail(productId);
  const { data: reviewsData, isLoading } = useReviews(productId, page, perPage);
  const createReview = useCreateReview();

  const totalPages = reviewsData ? Math.ceil(reviewsData.total / perPage) : 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    createReview.mutate(
      { product_id: productId, rating, comment },
      {
        onSuccess: () => {
          setComment("");
          setRating(5);
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link to={`/products/${productId}`} className="text-blue-600 hover:text-blue-500 font-medium text-sm">
          &larr; Kembali ke Produk
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
          Ulasan untuk {product?.name || "Produk"}
        </h1>
      </div>

      {/* Form Tambah Ulasan (Simulasi login) */}
      <Card className="mb-10">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tulis Ulasan Anda</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Bagaimana pendapat Anda tentang produk ini?"
                required
              />
            </div>
            <Button type="submit" isLoading={createReview.isPending}>
              Kirim Ulasan
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Daftar Ulasan */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Semua Ulasan</h3>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 h-32 rounded-lg w-full"></div>
            ))}
          </div>
        ) : reviewsData?.data.length === 0 ? (
          <p className="text-gray-500">Belum ada ulasan untuk produk ini.</p>
        ) : (
          <div className="space-y-6">
            {reviewsData?.data.map((review: any) => (
              <div key={review.id} className="border-b border-gray-200 pb-6">
                <div className="flex items-center mb-2">
                  <div className="font-medium text-gray-900 mr-2">{review.user_name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.created_at || "").toLocaleDateString("id-ID")}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
