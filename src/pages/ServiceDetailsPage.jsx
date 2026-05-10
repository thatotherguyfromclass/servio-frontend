/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Star,
  MessageCircle,
  Globe,
  Loader2,
  ExternalLink,
} from "lucide-react";
import api from "../api/axios";

const normalizeUrl = (url) => {
  if (!url) return null;

  if (
    url.includes("instagram.com") ||
    url.includes("twitter.com") ||
    url.includes("x.com")
  ) {
    return url.startsWith("http") ? url : `https://${url}`;
  }

  if (url.startsWith("http")) return url;

  return `https://${url}`;
};

const normalizeWhatsApp = (value) => {
  if (!value) return null;

  if (value.startsWith("http")) return value;

  const clean = value.replace(/\D/g, "");

  const formatted = clean.startsWith("0") ? "234" + clean.slice(1) : clean;

  return `https://wa.me/${formatted}`;
};

const getInstagramUrl = (value) => {
  if (!value) return null;

  if (value.includes("instagram.com")) {
    return normalizeUrl(value);
  }

  return `https://instagram.com/${value.replace("@", "")}`;
};

const getTwitterUrl = (value) => {
  if (!value) return null;

  if (value.includes("twitter.com") || value.includes("x.com")) {
    return normalizeUrl(value);
  }

  return `https://twitter.com/${value.replace("@", "")}`;
};

const ServiceDetailsPage = () => {
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/services/${id}`);
      setService(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewLoading(true);
      const response = await api.get(`/reviews/service/${id}`);
      setReviews(response.data.reviews || []);
      setReviewStats(response.data.stats);
    } catch (error) {
      console.log(error);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      setReviewSubmitting(true);

      await api.post("/reviews", {
        service_id: id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });

      setReviewForm({
        rating: 5,
        comment: "",
      });

      await fetchReviews();
      await fetchService();
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  useEffect(() => {
    fetchService();
    fetchReviews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 text-center">
        <Loader2 className="animate-spin text-violet-700" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 text-center">
        <p className="text-gray-500">Service not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8">
          <div className="min-w-0">
            <div className="relative overflow-hidden rounded-[28px] sm:rounded-4xl bg-linear-to-br from-violet-700 via-violet-600 to-fuchsia-500 p-6 sm:p-10 text-white">
              <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-black/10 blur-3xl" />

              <div className="relative z-10">
                <div className="inline-flex px-3 sm:px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-xs sm:text-sm font-semibold">
                  {service.category_name}
                </div>

                <h1 className="mt-4 sm:mt-5 text-3xl sm:text-5xl font-black leading-tight wrap-break-word">
                  {service.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-5 sm:mt-6 text-violet-100 text-sm sm:text-base">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span className="wrap-break-word">
                      {service.state}
                      {service.city && `, ${service.city}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span>
                      {reviewStats?.average_rating || "New"} (
                      {reviewStats?.total_reviews || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 bg-white border border-gray-200 rounded-3xl sm:rounded-4xl p-5 sm:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                About this service
              </h2>

              <p className="mt-4 sm:mt-5 text-gray-600 leading-relaxed whitespace-pre-line text-sm sm:text-[15px]">
                {service.description}
              </p>
            </div>

            <div className="mt-5 sm:mt-6 bg-white border border-gray-200 rounded-3xl sm:rounded-4xl p-5 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-6">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Starting from
                  </p>

                  <h3 className="mt-2 text-3xl sm:text-4xl font-black text-violet-700">
                    {service.price ? `₦${service.price}` : "Negotiable"}
                  </h3>
                </div>

                <div className="inline-flex px-4 sm:px-5 py-2 sm:py-3 rounded-2xl bg-violet-100 text-violet-700 capitalize font-semibold text-sm sm:text-base">
                  {service.price_type}
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 bg-white border border-gray-200 rounded-3xl sm:rounded-4xl p-5 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Reviews
                  </h2>
                  <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
                    What clients are saying
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">
                    <Star className="fill-yellow-400 text-yellow-400" />
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                      {reviewStats?.average_rating || "0.0"}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {reviewStats?.total_reviews || 0} reviews
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleReviewSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Rating
                  </label>

                  <select
                    value={reviewForm.rating}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        rating: e.target.value,
                      })
                    }
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-violet-500"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Comment
                  </label>

                  <textarea
                    rows={4}
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        comment: e.target.value,
                      })
                    }
                    placeholder="Share your experience..."
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none resize-none focus:border-violet-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-violet-700 hover:bg-violet-800 text-white font-semibold transition disabled:opacity-70 flex items-center justify-center"
                >
                  {reviewSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit review"
                  )}
                </button>
              </form>

              <div className="mt-8 sm:mt-10 space-y-4">
                {reviewLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-violet-700" />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="border border-dashed border-gray-300 rounded-3xl p-8 sm:p-10 text-center">
                    <p className="text-gray-500">No reviews yet</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border border-gray-200 rounded-3xl p-4 sm:p-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-3">
                          {review.profile_image ? (
                            <img
                              src={review.profile_image}
                              alt={review.username}
                              className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-violet-100 flex items-center justify-center font-bold text-violet-700">
                              {review.username?.charAt(0)?.toUpperCase()}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">
                              @{review.username}
                            </p>

                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(review.rating)].map((_, index) => (
                                <Star
                                  key={index}
                                  size={14}
                                  className="fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {review.comment && (
                        <p className="mt-3 sm:mt-4 text-gray-600 leading-relaxed text-sm sm:text-base">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5 sm:space-y-6">
            <div className="bg-white border border-gray-200 rounded-3xl sm:rounded-4xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-4">
                {service.profile_image ? (
                  <Link to={`/users/${service.username}`}>
                    <img
                      src={service.profile_image}
                      alt={service.username}
                      className="w-16 sm:w-18 h-16 sm:h-18 rounded-3xl object-cover border border-gray-200 shrink-0"
                    />
                  </Link>
                ) : (
                  <Link to={`/users/${service.username}`}>
                    <div className="w-16 sm:w-18 h-16 sm:h-18 rounded-3xl bg-linear-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shrink-0 shadow-lg">
                      {service.username?.charAt(0)?.toUpperCase()}
                    </div>
                  </Link>
                )}

                <div className="min-w-0">
                  <Link
                    to={`/users/${service.username}`}
                    className="text-lg sm:text-2xl font-bold text-gray-900 hover:text-violet-700 transition wrap-break-word"
                  >
                    @{service.username}
                  </Link>

                  <p className="text-gray-500 mt-1 text-sm sm:text-base">
                    {service.full_name}
                  </p>
                </div>
              </div>

              {service.bio && (
                <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-100">
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {service.bio}
                  </p>
                </div>
              )}

              <div className="mt-5 sm:mt-6 space-y-3">
                {service.whatsapp && (
                  <a
                    href={normalizeWhatsApp(service.whatsapp)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-12 sm:h-13 rounded-2xl bg-green-500 hover:bg-green-600 transition text-white flex items-center justify-center gap-2 font-semibold"
                  >
                    <MessageCircle size={18} />
                    WhatsApp
                  </a>
                )}

                {service.instagram && (
                  <a
                    href={getInstagramUrl(service.instagram)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-12 sm:h-13 rounded-2xl bg-linear-to-r from-pink-500 to-orange-400 transition text-white flex items-center justify-center gap-2 font-semibold"
                  >
                    <ExternalLink size={18} />
                    Instagram
                  </a>
                )}

                {service.twitter && (
                  <a
                    href={getTwitterUrl(service.twitter)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-12 sm:h-13 rounded-2xl bg-black hover:opacity-90 transition text-white flex items-center justify-center gap-2 font-semibold"
                  >
                    <ExternalLink size={18} />
                    Twitter / X
                  </a>
                )}

                {service.website && (
                  <a
                    href={normalizeUrl(service.website)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-12 sm:h-13 rounded-2xl bg-violet-700 hover:bg-violet-800 transition text-white flex items-center justify-center gap-2 font-semibold"
                  >
                    <Globe size={18} />
                    Visit Website
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl sm:rounded-4xl p-5 sm:p-6 shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Trust & Reviews
              </h3>

              <div className="mt-4 sm:mt-5 flex items-center gap-4">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-3xl bg-yellow-100 flex items-center justify-center">
                  <Star className="fill-yellow-400 text-yellow-400" />
                </div>

                <div>
                  <h4 className="text-2xl sm:text-3xl font-black text-gray-900">
                    {reviewStats?.average_rating || "New"}
                  </h4>

                  <p className="text-sm text-gray-500 mt-1">
                    Based on {reviewStats?.total_reviews || 0} reviews
                  </p>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">Provider</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {service.full_name}
                  </p>
                </div>

                <Link
                  to={`/users/${service.username}`}
                  className="w-full sm:w-auto px-5 h-11 rounded-2xl bg-violet-700 hover:bg-violet-800 text-white font-semibold transition flex items-center justify-center"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;