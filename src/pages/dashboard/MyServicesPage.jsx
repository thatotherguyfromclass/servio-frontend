/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  BriefcaseBusiness,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Loader2,
} from "lucide-react";

import api from "../../api/axios";

const MyServicesPage = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);

      const response = await api.get("/services/me");

      setServices(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (serviceId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(serviceId);

      await api.delete(`/services/${serviceId}`);

      setServices((prev) =>
        prev.filter((service) => service.id !== serviceId)
      );
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-violet-700" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            My Services
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all your service listings.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/services/create")}
          className="h-12 px-6 bg-violet-700 hover:bg-violet-800 transition text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-md"
        >
          <Plus size={18} />
          Create Service
        </button>
      </div>

      {/* EMPTY STATE */}
      {services.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center shadow-sm">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-violet-100 flex items-center justify-center mb-5">
            <BriefcaseBusiness className="text-violet-700" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            No services yet
          </h2>

          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            Start offering your skills and get discovered by people near you.
          </p>

          <button
            onClick={() => navigate("/dashboard/services/create")}
            className="mt-6 px-6 h-12 bg-violet-700 hover:bg-violet-800 transition text-white rounded-2xl font-semibold"
          >
            Create Your First Service
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* LEFT */}
                <div>
                  <p className="text-sm font-semibold text-violet-700">
                    {service.category_name}
                  </p>

                  <Link
                    to={`/services/${service.id}`}
                    className="text-2xl font-bold text-gray-900 hover:text-violet-700 transition mt-1 inline-block"
                  >
                    {service.title}
                  </Link>

                  <p className="text-gray-500 mt-3 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-5 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>
                        {service.state}
                        {service.city && `, ${service.city}`}
                      </span>
                    </div>

                    <div className="capitalize">
                      {service.price
                        ? `₦${service.price}`
                        : "Negotiable"}{" "}
                      • {service.price_type}
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-3">
                  <button className="h-11 px-5 rounded-2xl border border-gray-300 hover:bg-gray-100 transition flex items-center gap-2 font-medium">
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(service.id)}
                    disabled={deletingId === service.id}
                    className="h-11 px-5 rounded-2xl bg-red-500 hover:bg-red-600 transition text-white flex items-center gap-2 font-medium disabled:opacity-70"
                  >
                    {deletingId === service.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}

                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyServicesPage;