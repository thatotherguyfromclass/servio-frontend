/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Globe,
  MessageCircle,
  ExternalLink,
  Loader2,
  BriefcaseBusiness,
} from "lucide-react";
import api from "../api/axios";

const PublicProfilePage = () => {
  const { username } = useParams();

  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔧 WEBSITE NORMALIZER
  const normalizeUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `https://${url}`;
  };

  // 🔧 WHATSAPP FIX
  const getWhatsAppUrl = (number) => {
    if (!number) return null;

    const clean = number.replace(/\D/g, "");

    const formatted = clean.startsWith("0")
      ? "234" + clean.slice(1)
      : clean;

    return `https://wa.me/${formatted}`;
  };

  // 🔧 INSTAGRAM FIX
  const getInstagramUrl = (username) => {
    if (!username) return null;
    return `https://instagram.com/${username.replace("@", "")}`;
  };

  // 🔧 TWITTER FIX
  const getTwitterUrl = (username) => {
    if (!username) return null;
    return `https://twitter.com/${username.replace("@", "")}`;
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/users/${username}`);

      setUser(response.data);

      const servicesRes = await api
        .get(`/services?username=${username}`)
        .catch(() => ({ data: [] }));

      setServices(servicesRes.data || []);
    } catch (error) {
      console.log(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <Loader2 className="animate-spin text-violet-700" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-5 py-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Link to={`/users/${user.username}`}>
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={user.full_name}
                  className="w-24 h-24 rounded-3xl object-cover border border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-violet-100 flex items-center justify-center text-3xl font-bold text-violet-700">
                  {user.full_name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </Link>

            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-gray-900">
                {user.full_name}
              </h1>

              <p className="text-gray-500">@{user.username}</p>

              <div className="flex items-center gap-2 text-gray-500 mt-2">
                <MapPin size={16} />
                <span>
                  {user.state}
                  {user.city && `, ${user.city}`}
                </span>
              </div>

              {user.bio && (
                <p className="text-gray-600 mt-4">{user.bio}</p>
              )}

              {/* SOCIAL LINKS */}
              <div className="flex flex-wrap gap-3 mt-5">
                {user.whatsapp && (
                  <a
                    href={getWhatsAppUrl(user.whatsapp)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-green-500 text-white rounded-2xl flex items-center gap-2"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </a>
                )}

                {user.instagram && (
                  <a
                    href={getInstagramUrl(user.instagram)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-pink-500 text-white rounded-2xl flex items-center gap-2"
                  >
                    <ExternalLink size={16} />
                    Instagram
                  </a>
                )}

                {user.twitter && (
                  <a
                    href={getTwitterUrl(user.twitter)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-black text-white rounded-2xl flex items-center gap-2"
                  >
                    <ExternalLink size={16} />
                    Twitter
                  </a>
                )}

                {user.website && (
                  <a
                    href={normalizeUrl(user.website)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-violet-700 text-white rounded-2xl flex items-center gap-2"
                  >
                    <Globe size={16} />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div className="max-w-5xl mx-auto px-5 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Services
        </h2>

        {services.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-10 text-center">
            <BriefcaseBusiness className="mx-auto text-violet-700 mb-3" />
            <p className="text-gray-500">No services yet</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="bg-white border border-gray-200 rounded-3xl p-6 hover:shadow-md transition"
              >
                <p className="text-violet-700 font-semibold">
                  {service.category_name}
                </p>

                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {service.title}
                </h3>

                <p className="text-gray-500 mt-2 line-clamp-2">
                  {service.description}
                </p>

                <p className="text-sm text-gray-500 mt-3">
                  {service.state}
                  {service.city && `, ${service.city}`} •{" "}
                  {service.price ? `₦${service.price}` : "Negotiable"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfilePage;