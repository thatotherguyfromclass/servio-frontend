/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Loader2,
  MapPin,
  Eye,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const inputStyles =
  "w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [services, setServices] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editingService, setEditingService] =
    useState(null);

  const [editForm, setEditForm] =
    useState({
      category_id: "",
      title: "",
      description: "",
      price: "",
      price_type: "",
      state: "",
      city: "",
    });

  const fetchMyServices = async () => {
    try {
      const res = await api.get(
        "/services/me"
      );

      setServices(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyServices();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(
        `/services/${id}`
      );

      setServices((prev) =>
        prev.filter(
          (service) =>
            service.id !== id
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const openEditModal = (
    service
  ) => {
    setEditingService(service);

    setEditForm({
      category_id:
        service.category_id,
      title: service.title,
      description:
        service.description,
      price: service.price,
      price_type:
        service.price_type,
      state: service.state,
      city: service.city,
    });
  };

  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);

      const res = await api.patch(
        `/services/${editingService.id}`,
        editForm
      );

      setServices((prev) =>
        prev.map((service) =>
          service.id ===
          editingService.id
            ? res.data
            : service
        )
      );

      setEditingService(null);
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-violet-700 via-violet-600 to-fuchsia-500 p-8 sm:p-10 text-white">
          <div className="absolute -top-25 -right-20 w-62.5 h-62.5 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-30 -left-25 w-62.5 h-62.5 rounded-full bg-black/10 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-violet-100 mb-3">
                Servio Dashboard
              </p>

              <h1 className="text-4xl sm:text-5xl font-black leading-tight">
                Manage your services
              </h1>

              <p className="mt-4 text-violet-100 text-base sm:text-lg leading-relaxed">
                Edit, update and manage your
                professional listings all in
                one place.
              </p>
            </div>

            <button
              onClick={() =>
                navigate(
                  "/dashboard/services/create"
                )
              }
              className="h-14 px-6 rounded-2xl bg-white text-violet-700 font-semibold flex items-center justify-center gap-2 hover:bg-violet-50 transition shadow-xl"
            >
              <Plus size={20} />
              New Service
            </button>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Your services
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {services.length} services
              listed
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-violet-700" />
          </div>
        ) : services.length === 0 ? (
          <div className="mt-8 bg-white border border-gray-200 rounded-4xl p-12 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-violet-100 flex items-center justify-center">
              <Plus className="text-violet-700" />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-gray-900">
              No services yet
            </h3>

            <p className="mt-3 text-gray-500 max-w-md mx-auto">
              Start building your presence
              on Servio by creating your
              first service listing.
            </p>

            <button
              onClick={() =>
                navigate(
                  "/dashboard/services/create"
                )
              }
              className="mt-6 h-12 px-6 rounded-2xl bg-violet-700 text-white font-semibold hover:bg-violet-800 transition"
            >
              Create service
            </button>
          </div>
        ) : (
          <div className="mt-8 grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="group bg-white border border-gray-200 rounded-[30px] p-6 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-200 transition duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-4">
                      <button
                        onClick={() =>
                          navigate(
                            `/users/${service.username}`
                          )
                        }
                        className="flex items-center gap-3 group/profile"
                      >
                        {service.profile_image ? (
                          <img
                            src={service.profile_image}
                            alt={service.username}
                            className="w-11 h-11 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-md">
                            {service.username
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>
                        )}

                        <div className="text-left">
                          <p className="text-sm font-semibold text-gray-900 group-hover/profile:text-violet-700 transition">
                            @{service.username}
                          </p>

                          <p className="text-xs text-gray-400">
                            View profile
                          </p>
                        </div>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
                        {service.category_name}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 leading-tight line-clamp-2">
                      {service.title}
                    </h2>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-lg shrink-0">
                    {service.title
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-gray-500 line-clamp-3">
                  {service.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={15} />

                    <span>
                      {service.state}
                      {service.city &&
                        `, ${service.city}`}
                    </span>
                  </div>

                  <span className="text-sm font-medium text-violet-700 capitalize">
                    {
                      service.price_type
                    }
                  </span>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100 flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400 font-medium">
                      Price
                    </p>

                    <p className="mt-1 text-2xl font-black text-violet-700">
                      {service.price
                        ? `₦${service.price}`
                        : "Negotiable"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        navigate(
                          `/services/${service.id}`
                        )
                      }
                      className="w-11 h-11 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() =>
                        openEditModal(
                          service
                        )
                      }
                      className="w-11 h-11 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          service.id
                        )
                      }
                      className="w-11 h-11 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {editingService && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-4xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Edit service
                  </h2>

                  <p className="mt-2 text-gray-500">
                    Update your service
                    information.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setEditingService(
                      null
                    )
                  }
                  className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-8 space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Service title
                  </label>

                  <input
                    name="title"
                    value={editForm.title}
                    onChange={handleChange}
                    placeholder="Service title"
                    className={
                      inputStyles
                    }
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      editForm.description
                    }
                    onChange={handleChange}
                    placeholder="Service description"
                    rows={5}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none resize-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Price
                    </label>

                    <input
                      name="price"
                      type="number"
                      value={
                        editForm.price ||
                        ""
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="5000"
                      className={
                        inputStyles
                      }
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Price type
                    </label>

                    <input
                      name="price_type"
                      value={
                        editForm.price_type ||
                        ""
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="fixed"
                      className={
                        inputStyles
                      }
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      State
                    </label>

                    <input
                      name="state"
                      value={
                        editForm.state
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Lagos"
                      className={
                        inputStyles
                      }
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      City
                    </label>

                    <input
                      name="city"
                      value={
                        editForm.city
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Ikeja"
                      className={
                        inputStyles
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={() =>
                    setEditingService(
                      null
                    )
                  }
                  className="h-12 px-6 rounded-2xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="h-12 px-6 rounded-2xl bg-violet-700 hover:bg-violet-800 text-white font-semibold transition disabled:opacity-70"
                >
                  {saving
                    ? "Saving..."
                    : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;