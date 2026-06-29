import { useState } from "react";
import { useReviews } from "../../hooks/queries/reviews/useReviews";
import { useCreateReview } from "../../hooks/mutations/reviews/useCreateReview";
import { Button } from "../ui";
import { Star, MessageSquareQuote, Send } from "lucide-react";

export function AppReviews() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

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
          setIsFormOpen(false);
        },
      }
    );
  };

  return (
    <div className="bg-white py-24 border-t border-slate-200">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-4 border border-blue-100">
              <MessageSquareQuote className="w-4 h-4" />
              <span>Suara Pengguna</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Apa Kata Mereka Tentang Seapedia?
            </h2>
            <p className="text-slate-500 mt-4 text-lg">
              Ribuan pembeli dan penjual telah membuktikan kemudahan bertransaksi bersama kami.
            </p>
          </div>
          <Button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-6 py-2.5 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
          >
            {isFormOpen ? "Tutup Form Ulasan" : "Tulis Ulasan Anda"}
          </Button>
        </div>

        {isFormOpen && (
          <div className="mb-12 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"></div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6 relative z-10">Bagikan Pengalaman Anda</h3>
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10 max-w-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Penilaian Anda</label>
                  <div className="flex items-center gap-1.5 h-[46px] bg-white border border-slate-300 rounded-xl px-4 shadow-sm">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-7 w-7 transition-colors ${
                            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Komentar & Masukan</label>
                <textarea
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm resize-none"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ceritakan kepuasan Anda menggunakan aplikasi Seapedia..."
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  isLoading={createReview.isPending}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl px-8 py-2.5 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Kirim Ulasan
                </Button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-100 h-48 rounded-3xl w-full border border-slate-200"></div>
            ))}
          </div>
        ) : !reviews || reviews.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
            <MessageSquareQuote className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Belum Ada Ulasan</h3>
            <p className="text-slate-500">Jadilah yang pertama membagikan pengalaman Anda!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed mb-6 line-clamp-4 relative z-10">
                  "{review.comment}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-inner">
                    {review.reviewer_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{review.reviewer_name}</div>
                    <div className="text-xs text-slate-500 font-medium">
                      {new Date(review.created_at).toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
