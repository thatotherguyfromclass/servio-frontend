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
  if (url.startsWith("http")) return url;
  return `https://${url}`;
};

const normalizeWhatsApp = (value) => {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  const number = value.replace(/\D/g, "");
  return `https://wa.me/${number}`;
};

const ServiceDetailsPage = () => {
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <Loader2 className="animate-spin text-violet-700" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <p className="text-gray-500">Service not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div>
            <div className="relative overflow-hidden rounded-[32px] bg-linear-to-br from-violet-700 via-violet-600 to-fuchsia-500 p-8 sm:p-10 text-white">
              <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-black/10 blur-3xl" />

              <div className="relative z-10">
                <div className="inline-flex px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-sm font-semibold">
                  {service.category_name}
                </div>

                <h1 className="mt-5 text-4xl sm:text-5xl font-black leading-tight max-w-4xl">
                  {service.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 mt-6 text-violet-100">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>
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
                      {service.average_rating || "New"} ({service.total_reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white border border-gray-200 rounded-[32px] p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">
                About this service
              </h2>

              <p className="mt-5 text-gray-600 leading-relaxed whitespace-pre-line text-[15px]">
                {service.description}
              </p>
            </div>

            <div className="mt-6 bg-white border border-gray-200 rounded-[32px] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Starting from
                  </p>

                  <h3 className="mt-2 text-4xl font-black text-violet-700">
                    {service.price ? `₦${service.price}` : "Negotiable"}
                  </h3>
                </div>

                <div className="inline-flex px-5 py-3 rounded-2xl bg-violet-100 text-violet-700 capitalize font-semibold">
                  {service.price_type}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-[32px] p-6 shadow-sm">
              <div className="flex items-center gap-4">
                {service.profile_image ? (
                  <Link to={`/users/${service.username}`}>
                    <img
                      src={service.profile_image}
                      alt={service.username}
                      className="w-18 h-18 rounded-3xl object-cover border border-gray-200 shrink-0"
                    />
                  </Link>
                ) : (
                  <Link to={`/users/${service.username}`}>
                    <div className="w-18 h-18 rounded-3xl bg-linear-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-lg">
                      {service.username?.charAt(0)?.toUpperCase()}
                    </div>
                  </Link>
                )}

                <div>
                  <Link
                    to={`/users/${service.username}`}
                    className="text-2xl font-bold text-gray-900 hover:text-violet-700 transition"
                  >
                    @{service.username}
                  </Link>

                  <p className="text-gray-500 mt-1">
                    {service.full_name}
                  </p>
                </div>
              </div>

              {service.bio && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-gray-600 leading-relaxed">
                    {service.bio}
                  </p>
                </div>
              )}

              <div className="mt-6 space-y-3">
                {service.whatsapp && (
                  <a
                    href={normalizeWhatsApp(service.whatsapp)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-13 rounded-2xl bg-green-500 hover:bg-green-600 transition text-white flex items-center justify-center gap-2 font-semibold shadow-sm"
                  >
                    <MessageCircle size={18} />
                    WhatsApp
                  </a>
                )}

                {service.instagram && (
                  <a
                    href={normalizeUrl(service.instagram)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-13 rounded-2xl bg-linear-to-r from-pink-500 to-orange-400 transition text-white flex items-center justify-center gap-2 font-semibold shadow-sm"
                  >
                    <ExternalLink size={18} />
                    Instagram
                  </a>
                )}

                {service.twitter && (
                  <a
                    href={normalizeUrl(service.twitter)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-13 rounded-2xl bg-black hover:opacity-90 transition text-white flex items-center justify-center gap-2 font-semibold shadow-sm"
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
                    className="w-full h-13 rounded-2xl bg-violet-700 hover:bg-violet-800 transition text-white flex items-center justify-center gap-2 font-semibold shadow-sm"
                  >
                    <Globe size={18} />
                    Visit Website
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-[32px] p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">
                Trust & Reviews
              </h3>

              <div className="mt-5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-yellow-100 flex items-center justify-center">
                  <Star className="fill-yellow-400 text-yellow-400" />
                </div>

                <div>
                  <h4 className="text-3xl font-black text-gray-900">
                    {service.average_rating || "New"}
                  </h4>

                  <p className="text-gray-500 mt-1">
                    Based on {service.total_reviews} reviews
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Provider</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {service.full_name}
                  </p>
                </div>

                <Link
                  to={`/users/${service.username}`}
                  className="px-5 h-11 rounded-2xl bg-violet-700 hover:bg-violet-800 text-white font-semibold transition flex items-center justify-center"
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