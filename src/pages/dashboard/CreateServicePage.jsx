/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
  Loader2,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const inputStyles =
  "w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

const CreateServicePage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    category_id: "",
    title: "",
    description: "",
    price: "",
    price_type: "fixed",
    state: "",
    city: "",
  });

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post("/services", formData);

      navigate("/dashboard/services");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create service"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-5xl mx-auto px-4 sm:px-5 py-8">
        <div className="relative overflow-hidden rounded-3xl sm:rounded-4xl bg-linear-to-br from-violet-700 via-violet-600 to-fuchsia-500 p-6 sm:p-10 text-white">
          <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-52 h-52 rounded-full bg-black/10 blur-3xl" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-5 text-center sm:text-left items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10">
              <BriefcaseBusiness size={28} />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm font-medium mb-4">
                <Sparkles size={15} />
                Start getting discovered
              </div>

              <h1 className="text-3xl sm:text-5xl font-black leading-tight">
                Create a new service
              </h1>

              <p className="mt-4 text-violet-100 text-base sm:text-lg leading-relaxed max-w-2xl">
                Publish your service on Servio and connect with people searching for trusted professionals near them.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white border border-gray-200 rounded-3xl sm:rounded-4xl p-5 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="px-4 py-3 rounded-2xl border border-red-200 bg-red-50 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Category
                </label>

                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className={inputStyles}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Service title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Professional plumbing services"
                  className={inputStyles}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                rows={6}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your service..."
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none resize-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="5000"
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Price type
                </label>

                <select
                  name="price_type"
                  value={formData.price_type}
                  onChange={handleChange}
                  className={inputStyles}
                >
                  <option value="fixed">Fixed</option>
                  <option value="hourly">Hourly</option>
                  <option value="negotiable">Negotiable</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className={inputStyles}
              />

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className={inputStyles}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between pt-2">
              <p className="text-sm text-gray-500 text-center sm:text-left">
                Your service will be visible to users searching in your area.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="h-12 px-6 sm:px-7 w-full sm:w-auto rounded-2xl bg-violet-700 hover:bg-violet-800 text-white font-semibold transition disabled:opacity-70 shadow-lg shadow-violet-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create service"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateServicePage;